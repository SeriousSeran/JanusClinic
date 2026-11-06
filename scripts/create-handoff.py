"""Create a portable source checkpoint; never include environment files or dependencies."""
from pathlib import Path
import json
import subprocess
import zipfile

ROOT = Path(__file__).resolve().parent.parent
files = subprocess.check_output(['git', 'ls-files', '--cached', '--others', '--exclude-standard', '-z'], cwd=ROOT).decode().split('\0')
output = ROOT / 'artifacts/janusclinic-handoff.zip'
output.parent.mkdir(exist_ok=True)
commit = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip()
with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
    included = []
    for name in sorted(set(files)):
        if not name:
            continue
        path = ROOT / name
        if not path.is_file() or path.is_symlink():
            continue
        if any(part in {'.git', 'node_modules', '.build', 'dist', 'artifacts', '__pycache__', 'test-results', 'playwright-report', '.superpowers', 'generated'} for part in path.relative_to(ROOT).parts):
            continue
        if path.name == '.env' or path.name.startswith('.env.') or path.suffix in {'.pem', '.key', '.p12'}:
            continue
        archive.write(path, 'JanusClinic/' + name)
        included.append(name)
    archive.writestr('START_HERE.txt', 'Continue in https://github.com/SeriousSeran/JanusClinic on main. Read JanusClinic/HANDOFF.md. This is source, not a deployed application. Compare remote HEAD before restoring any file.\n')
    archive.writestr('checkpoint.json', json.dumps({'repository': 'SeriousSeran/JanusClinic', 'branch': 'main', 'commit': commit, 'files': len(included)}, indent=2))
with zipfile.ZipFile(output) as archive:
    assert archive.testzip() is None
    assert 'JanusClinic/HANDOFF.md' in archive.namelist()
    assert 'JanusClinic/reference/catalogs/salon-catalog.jpg' in archive.namelist()
print(f'{output}: {len(included)} files, {output.stat().st_size} bytes; ZIP integrity verified.')
