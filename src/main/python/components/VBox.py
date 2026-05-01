from PySide6.QtWidgets import QVBoxLayout

def BoxLayout(parent=None, margins=(0,0,0,0), spacing=0):
    layout = QVBoxLayout(parent)

    layout.setContentsMargins(*margins)
    layout.setSpacing(spacing)

    return layout