import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from pathlib import Path
from ai import create_workflow


def main():
    args = sys.argv[1:]

    if not args:
        print("Usage: python run_ocr.py [image_path_or_folder]")
        print("       python run_ocr.py images")
        print("       python run_ocr.py images/doctor_note_1.jpg")
        sys.exit(1)

    target = args[0]
    path = Path(target)

    if not path.exists():
        print(f"Not found: {target}")
        sys.exit(1)

    print(f"Processing: {target}")
    wf = create_workflow(output_dir="output")
    wf.process_and_print(str(target))


if __name__ == "__main__":
    main()
