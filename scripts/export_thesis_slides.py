"""Export the rendered main Manim deck without importing or rendering its scenes.

Run with the thesis project's Manim Python environment, from this website root:
  ../phd-thesis-presentation/03-manim-presentation/manimations/.venv/bin/python \
    scripts/export_thesis_slides.py \
    ../phd-thesis-presentation/03-manim-presentation/manimations
"""

import argparse
import ast
from pathlib import Path
import subprocess

from manim_slides.config import PresentationConfig
from manim_slides.convert import RevealJS


def scene_order(source, name):
    """Read the source's authoritative order, including starred module tuples."""
    tree = ast.parse(source.read_text())
    imports = {
        alias.asname or alias.name: alias.name
        for node in tree.body if isinstance(node, ast.Import)
        for alias in node.names
    }
    assignments = {
        target.id: node.value
        for node in tree.body if isinstance(node, ast.Assign)
        for target in node.targets if isinstance(target, ast.Name)
    }

    def resolve(node):
        if isinstance(node, ast.Constant) and isinstance(node.value, str):
            return [node.value]
        if isinstance(node, (ast.Tuple, ast.List)):
            return [item for entry in node.elts for item in resolve(entry)]
        if isinstance(node, ast.Starred):
            return resolve(node.value)
        if isinstance(node, ast.Name):
            return resolve(assignments[node.id])
        if isinstance(node, ast.Attribute) and isinstance(node.value, ast.Name):
            return scene_order(source.with_name(imports[node.value.id] + ".py"), node.attr)
        raise ValueError(f"Unsupported scene-order expression: {ast.dump(node)}")

    return resolve(assignments[name])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    source = args.source.resolve()
    destination = root / "assets/thesis"
    scenes = scene_order(source / "presentation.py", "MAIN_SCENES_IN_ORDER")
    configs = [PresentationConfig.from_file(source / "slides" / f"{scene}.json") for scene in scenes]
    # Validate every clip before exporting anything; backup scenes are never included.
    for config in configs:
        for slide in config.slides:
            if not slide.file.is_file():
                raise FileNotFoundError(slide.file)
    RevealJS(
        presentation_configs=configs,
        template=root / "scripts/thesis-slides.html.j2",
        assets_dir="media",
        title="Demand-Aware Networks: Design, Adjust & Update — Arash Pourdamghani",
    ).convert_to(destination / "slides/index.html")
    for scene, filename in [
        ("LifecycleOverviewSlide", "lifecycle-overview.png"),
        ("ChapterContributionsMetasurfaceSlide", "other-papers.png"),
    ]:
        clip = configs[scenes.index(scene)].slides[-1].file
        subprocess.run([
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
            "-sseof", "-0.1", "-i", str(clip), "-frames:v", "1",
            "-update", "1", str(destination / filename),
        ], check=True)
    print(f"Exported {len(scenes)} main scenes / {sum(len(c.slides) for c in configs)} steps.")


if __name__ == "__main__":
    main()
