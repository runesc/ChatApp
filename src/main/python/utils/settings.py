from ppg_runtime._source import get_project_dir, load_build_settings


def get_public_settings(): return load_build_settings(get_project_dir())
