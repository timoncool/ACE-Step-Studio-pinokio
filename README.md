<div align="center">

# ACE-Step Studio — Pinokio launcher

**One-click cross-platform installer for [ACE-Step Studio](https://github.com/timoncool/ACE-Step-Studio) — local AI music generation. Suno at home.**

[![Install on Pinokio](https://img.shields.io/badge/🚀_Install_on-Pinokio-7c3aed?style=for-the-badge)](https://pinokio.co/item?uri=https://github.com/timoncool/ACE-Step-Studio-pinokio)
[![Open in Pinokio](https://img.shields.io/badge/📂_Open_in-Pinokio-6d28d9?style=for-the-badge)](https://beta.pinokio.co/apps/github-com-timoncool-ace-step-studio-pinokio)
[![Main repo](https://img.shields.io/badge/App_Source-ACE--Step--Studio-24292e?style=for-the-badge&logo=github&logoColor=white)](https://github.com/timoncool/ACE-Step-Studio)
[![Donate](https://img.shields.io/badge/💖_Support-Donate-ff69b4?style=for-the-badge)](DONATE.md)

[![Stars](https://img.shields.io/github/stars/timoncool/ACE-Step-Studio-pinokio?style=flat-square&logo=github)](https://github.com/timoncool/ACE-Step-Studio-pinokio/stargazers)
[![License](https://img.shields.io/github/license/timoncool/ACE-Step-Studio-pinokio?style=flat-square)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/timoncool/ACE-Step-Studio-pinokio?style=flat-square)](https://github.com/timoncool/ACE-Step-Studio-pinokio/commits/main)
[![Issues](https://img.shields.io/github/issues/timoncool/ACE-Step-Studio-pinokio?style=flat-square)](https://github.com/timoncool/ACE-Step-Studio-pinokio/issues)
[![Code size](https://img.shields.io/github/languages/code-size/timoncool/ACE-Step-Studio-pinokio?style=flat-square)](https://github.com/timoncool/ACE-Step-Studio-pinokio)
[![Pinokio](https://img.shields.io/badge/Pinokio-topic-7c3aed?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZiI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48L3N2Zz4=)](https://pinokio.co/)

[![Windows](https://img.shields.io/badge/Windows-10/11-0078D6?style=flat-square&logo=windows&logoColor=white)](#platform-support-matrix)
[![Linux](https://img.shields.io/badge/Linux-x64_%2F_aarch64-FCC624?style=flat-square&logo=linux&logoColor=black)](#platform-support-matrix)
[![macOS](https://img.shields.io/badge/macOS-Apple_Silicon-000000?style=flat-square&logo=apple&logoColor=white)](#platform-support-matrix)
[![NVIDIA](https://img.shields.io/badge/NVIDIA-CUDA_12.8-76B900?style=flat-square&logo=nvidia&logoColor=white)](#platform-support-matrix)
[![AMD](https://img.shields.io/badge/AMD-DirectML_%2F_ROCm-ED1C24?style=flat-square&logo=amd&logoColor=white)](#platform-support-matrix)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white)](#)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.7.1-EE4C2C?style=flat-square&logo=pytorch&logoColor=white)](#)

</div>

This repository is the **Pinokio launcher** for [ACE-Step Studio](https://github.com/timoncool/ACE-Step-Studio) — the actual app lives there. This repo only contains the scripts that Pinokio runs to install, start, update and reset the app in an isolated cross-platform environment.

## Install

1. Download and install **[Pinokio](https://pinokio.co/)**
2. Open in Pinokio:
   - 🚀 **[Install (1-click)](https://pinokio.co/item?uri=https://github.com/timoncool/ACE-Step-Studio-pinokio)** — direct install URL
   - 📂 **[Browse app page](https://beta.pinokio.co/apps/github-com-timoncool-ace-step-studio-pinokio)** — catalog page on beta.pinokio.co
3. Click **Install** inside Pinokio — it will clone the app, create a Python 3.12 venv, install PyTorch (right build for your GPU), pull models on first run

## What this launcher does

- Isolated Python `venv` with **Python 3.12** via uv — no system-wide installs
- PyTorch auto-selected by GPU/OS — CUDA 12.8 (NVIDIA x64), CUDA 13.0 (aarch64), DirectML (AMD Win), ROCm 6.3 (AMD Linux), MPS/CPU (macOS), CPU fallback
- Triton + Flash-Attention 2 on NVIDIA Win/Linux (auto-skipped elsewhere)
- **MLX native acceleration** on Apple Silicon
- Bundled Node.js + npm + ffmpeg from Pinokio (no separate downloads)
- Frontend built via Vite, Express server via `tsx`
- Models cached under `app/models` (HF_HOME)
- Cross-platform: Windows / Linux x64 & aarch64 / macOS ARM & Intel

## Launch modes

| Menu item | What it runs |
|-----------|--------------|
| **Start (Standard)** | Full Express + DiT + LM (PT backend) |
| **Start (No LM)** | DiT only — more VRAM free, no AI lyrics |
| **Start (Dev)** | `tsx watch` + Vite HMR (for launcher development) |
| **Open Folder** | File explorer at Generated Audio / App Data / Models cache |
| **Update** | `git pull` launcher + app + ACE-Step-1.5 + rebuild frontend |
| **Save Disk Space** | Dedup venv libraries via `fs.link` |
| **Reset** | Wipe `app/` folder (full pre-install state) |

## Platform support matrix

| OS | GPU | Status | Acceleration |
|---|---|---|---|
| Windows 10/11 | NVIDIA RTX 20xx–50xx | ✅ tested | CUDA 12.8 + Triton + Flash-Attn |
| Linux x64 | NVIDIA RTX 20xx–50xx | ✅ expected | CUDA 12.8 + Triton + Flash-Attn |
| Linux aarch64 | NVIDIA DGX Spark / Jetson | ✅ expected | CUDA 13.0 |
| Windows | AMD RDNA3+ | ✅ expected | DirectML |
| Linux | AMD RDNA3+ | ✅ expected | ROCm 6.3 |
| macOS | Apple Silicon M1–M4 | ✅ expected | MPS + MLX native |
| macOS | Intel | ⚠️ CPU-only | CPU |
| Any | CPU only | ⚠️ very slow | CPU |
| Win/Linux | NVIDIA GTX 10xx (Pascal) | ❌ `cu128` requires `sm_70+` | — |

## Links

- 🎵 **App source / issues** — [ACE-Step-Studio](https://github.com/timoncool/ACE-Step-Studio)
- 📰 **Changelog** — [CHANGELOG.md](https://github.com/timoncool/ACE-Step-Studio/blob/master/CHANGELOG.md)
- 🧠 **Base model** — [ACE-Step 1.5](https://github.com/ace-step/ACE-Step-1.5)
- 🎛️ **Upstream UI** — [fspecii/ace-step-ui](https://github.com/fspecii/ace-step-ui)
- 🚀 **Pinokio** — [pinokio.co](https://pinokio.co/)

## Support the author

If this saved you hours of dependency-juggling, consider a donation:

[![Donate Card](https://img.shields.io/badge/Card_%2F_PayPal-dalink.to-29ABE2?style=for-the-badge&logo=paypal&logoColor=white)](https://dalink.to/nerual_dreming)
[![Boosty](https://img.shields.io/badge/Monthly-Boosty-F15F2C?style=for-the-badge)](https://boosty.to/neuro_art)

Full donation guide (EN/RU) with crypto addresses and QR codes: **[DONATE.md](DONATE.md)**

## Author

- **Nerual Dreming** — [@timoncool](https://github.com/timoncool) · [Telegram](https://t.me/nerual_dreming) · [neuro-cartel.com](https://neuro-cartel.com) · [ArtGeneration.me](https://artgeneration.me)

## License

[MIT](LICENSE) — same as the main [ACE-Step Studio](https://github.com/timoncool/ACE-Step-Studio) project.

---

<div align="center">

### Star History

<a href="https://www.star-history.com/?repos=timoncool%2FACE-Step-Studio,timoncool%2FACE-Step-Studio-pinokio&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=timoncool/ACE-Step-Studio,timoncool/ACE-Step-Studio-pinokio&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=timoncool/ACE-Step-Studio,timoncool/ACE-Step-Studio-pinokio&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=timoncool/ACE-Step-Studio,timoncool/ACE-Step-Studio-pinokio&type=date&legend=top-left" />
 </picture>
</a>

</div>
