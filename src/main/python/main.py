import sys
from ppg_runtime.application_context.PySide6 import ApplicationContext
from ppg_runtime.application_context import PPGLifeCycle, Pydux, init_lifecycle, BridgeManager
from ppg_runtime.application_context.devtools.reloader import hot_reloading
from ppg_runtime.application_context.utils import app_is_frozen
from PySide6.QtWidgets import QMainWindow, QWidget, QVBoxLayout
from PySide6.QtWebEngineWidgets import QWebEngineView
from PySide6.QtCore import QUrl
from utils.settings import get_public_settings
from components.VBox import BoxLayout


@init_lifecycle
@hot_reloading
class ChatApp(QMainWindow, PPGLifeCycle, Pydux):
    def component_will_mount(self):
        self.subscribe_to_store(self)

        self.settings = get_public_settings()

    def render_(self):
        root = QWidget()
        layout = BoxLayout(margins=(0,0,0,0), spacing=0)
        webview = QWebEngineView()
        webview.load(
            QUrl(self.settings['host'])
            if self.settings['development']
            else QUrl.fromLocalFile(self.get_resource("chatapp-ui/index.html"))
        )

        layout.addWidget(webview)

        root.setLayout(layout)
        self.setCentralWidget(root)

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