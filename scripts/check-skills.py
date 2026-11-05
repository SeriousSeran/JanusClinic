"""Verify installed upstream skill files against the pinned installation manifest."""
import hashlib
import json
from pathlib import Path
import re

root = Path(__file__).resolve().parent.parent
lock = json.loads((root / '.agents/skills-lock.json').read_text())
checked = 0
names = set()
for entry in lock['skills']:
    folder = root / entry['installed_path']
    assert folder.is_relative_to(root / '.agents/skills'), entry['installed_path']
    assert re.fullmatch(r'[a-f0-9]{40}', entry['commit']), entry['name']
    text = (folder / 'SKILL.md').read_text()
    assert text.startswith('---\n'), entry['name']
    name = re.search(r'^name:\s*(.+)$', text, re.M).group(1).strip().strip('\"\'')
    assert name == entry['name'] == folder.name, entry['name']
    assert name not in names, 'Duplicate skill name: ' + name
    names.add(name)
    for relative, expected in entry['files_sha256'].items():
        file = folder / relative
        assert file.resolve().is_relative_to(folder.resolve()), relative
        assert hashlib.sha256(file.read_bytes()).hexdigest() == expected, str(file)
        checked += 1
assert len(names) == 24, names
print(f'Verified {len(names)} skill folders, {checked} upstream file hashes and pinned commits.')
