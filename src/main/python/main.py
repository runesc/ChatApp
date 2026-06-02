import sys
import json
import keyring
from ppg_runtime.application_context.PySide6 import ApplicationContext
from ppg_runtime.application_context import PPGLifeCycle, Pydux, init_lifecycle, BridgeManager
from ppg_runtime.application_context.devtools.reloader import hot_reloading
from ppg_runtime.application_context.utils import app_is_frozen
from PySide6.QtWidgets import QMainWindow, QWidget, QPushButton
from PySide6.QtWebEngineWidgets import QWebEngineView
from PySide6.QtCore import QUrl, Qt
from utils.settings import get_public_settings
from components.VBox import BoxLayout
from pydantic import BaseModel


class Settings(BaseModel):
    devTools: bool = False


@init_lifecycle
@hot_reloading
class ChatApp(QMainWindow, PPGLifeCycle, Pydux):
    def component_will_mount(self):
        self.subscribe_to_store(self)

        self.settings = get_public_settings()

        self.set_schema({
            'settings': Settings
        })

        self._bridge = None

    def handle_check_session(self, keyring_key):
        """
        Handler for JavaScript event 'check_session'. 
        Queries the OS keyring for the given key and returns a serialized JSON response.
        """
        print(f"Received check_session event with key: {keyring_key}")
        try:
            token = keyring.get_password("system", keyring_key)

            if token:
                return json.dumps({
                    "success": True,
                    "data": token
                })

            return json.dumps({
                "success": False,
                "error": "Session not found in keyring"
            })

        except Exception as e:
            print(f"Error accessing keyring: {e}")
            return json.dumps({
                "success": False,
                "error": str(e)
            })
        
    def handle_save_session(self, keyring_key, token):
        """
        Handler for JavaScript event 'save_session'. 
        Saves the provided token in the OS keyring under the given key and returns a serialized JSON response.
        """
        print(f"Received save_session event with key: {keyring_key} and token: {token}")
        try:
            keyring.set_password("system", keyring_key, token)
            return json.dumps({
                "success": True,
                "message": "Session saved successfully"
            })
        except Exception as e:
            print(f"Error saving to keyring: {e}")
            return json.dumps({
                "success": False,
                "error": str(e)
            })

    def render_(self):
        root = QWidget()
        self.layout = BoxLayout(margins=(0, 0, 0, 0), spacing=0)
        self.webview = QWebEngineView()
        self.webview.load(
            QUrl(self.settings['host'])
            if self.settings['development']
            else QUrl.fromLocalFile(self.get_resource("chatapp-ui/index.html"))
        )
        self.bridge = BridgeManager(self.webview, "bridge")
        #self.bridge.register("send_message", self.handle_send_message)
        self.bridge.register("check_session", self.handle_check_session)
        self.bridge.register("save_session", self.handle_save_session)

        self.layout.addWidget(self.webview)
        root.setLayout(self.layout)
        self.setCentralWidget(root)

    def keyPressEvent(self, event):
        is_dev_mode = self.get_nested('settings.devTools')

        if (event.key() == Qt.Key_Return or event.key() == Qt.Key_Enter) and not is_dev_mode:
            print("Enabling DevTools")

            self.btn_open = QPushButton(
                "Open DevTools", clicked=self.open_dev_tools)
            self.btn_close = QPushButton(
                "Close DevTools", clicked=self.close_dev_tools)

            self.test_emit = QPushButton(
                "Test Emit", clicked=lambda: self.bridge.emit("test_event", {"message": "Hello from Python!"}))

            self.layout.addWidget(self.btn_open)
            self.layout.addWidget(self.btn_close)
            self.layout.addWidget(self.test_emit)

            self.update_nested_model('settings', {'devTools': True})

    def close_dev_tools(self):
        self.update_nested_model('settings', {'devTools': False})

        if hasattr(self, 'dev_tools_window') and self.dev_tools_window:
            self.dev_tools_window.close()
            self.dev_tools_window = None

        if hasattr(self, 'btn_open'):
            self.btn_open.deleteLater()
        if hasattr(self, 'btn_close'):
            self.btn_close.deleteLater()

    def close_dev_tools(self):
        self.update_nested_model('settings', {'devTools': False})

        if hasattr(self, 'dev_tools_window') and self.dev_tools_window:
            self.dev_tools_window.close()
            self.dev_tools_window = None

        for i in reversed(range(self.layout.count())):
            item = self.layout.itemAt(i)
            if item and item.widget():
                widget = item.widget()
                if isinstance(widget, QPushButton) and "devtools" in widget.text().lower():
                    widget.deleteLater()

    def open_dev_tools(self):
        if not hasattr(self, 'dev_tools_window') or self.dev_tools_window is None:
            self.dev_tools_window = QWebEngineView()
            self.dev_tools_window.setWindowTitle("Developer Tools")
            self.dev_tools_window.resize(1000, 700)

        page_to_inspect = self.webview.page()
        page_to_inspect.setDevToolsPage(self.dev_tools_window.page())
        self.dev_tools_window.show()
        self.dev_tools_window.raise_()

    def responsive_UI(self):
        self.setMinimumSize(480, 640)


if __name__ == '__main__':
    appctxt = ApplicationContext()
    window = ChatApp()
    if not app_is_frozen():
        window._init_hot_reload_system(__file__)
    window.show()
    exec_func = getattr(appctxt.app, 'exec', appctxt.app.exec_)
    sys.exit(exec_func())
