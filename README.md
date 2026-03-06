# XHTML Runtime 🚀

**XHTML Runtime** is an open-source framework that extends standard HTML with the power of Lua. It provides a complete development toolkit to build and package your applications, from simple web pages to full desktop apps.

---

## Core Features

-   **Lua in HTML**: Write Lua code directly inside `<lua>` tags for dynamic content and logic.
-   **Modern CLI**: A powerful `xhtml` command to manage every aspect of your project lifecycle.
-   **Smart Compiler**: Automatically converts `.xhtml` files into standard, browser-ready `.html` files.
-   **Live Dev Server**: A development server with live-reloading for a seamless coding experience.
-   **Package Manager (XPM)**: A simple, built-in package manager for sharing and using Lua modules.
-   **Electron Builder**: Package your XHTML application as a distributable desktop app with a single command.

---

## Installation

Choose your operating system and run the corresponding command in your terminal.

#### Windows (PowerShell)

```powershell
# Installs the framework and adds the 'xhtml' command to your PATH
iex (irm https://raw.githubusercontent.com/Xznder1984/XHTML-RUNTIME/main/src/installers/install.ps1)
```

#### Linux / macOS (Bash)

```bash
# Installs the framework and adds the 'xhtml' command to your PATH
curl -fsSL https://raw.githubusercontent.com/Xznder1984/XHTML-RUNTIME/main/src/installers/install.sh | bash
```

---

## Getting Started

### 1. Create a New Project

Navigate to a directory where you want to create your project and run:

```bash
# This scaffolds a new project in the current directory
xhtml init
```

This command creates a default `index.xhtml` and `xhtml.json` file.

### 2. Start the Development Server

To see your application in action, run:

```bash
# Starts the dev server on http://localhost:3000
xhtml dev
```

Open your browser to `http://localhost:3000`. The server will automatically recompile your code and refresh the page when you make changes.

---

## CLI Command Reference

| Command                   | Description                                                 |
| ------------------------- | ----------------------------------------------------------- |
| `xhtml init`              | Initialize a new project in the current directory.          |
| `xhtml dev`               | Start the live-reloading development server.                |
| `xhtml build`             | Compile your `index.xhtml` to a production-ready `index.html`. |
| `xhtml install <package>` | Install a package from the XPM registry.                    |
| `xhtml publish`           | Publish your project as a package to the XPM registry.      |
| `xhtml electron`          | Build a distributable desktop application using Electron.   |

---

## Example `index.xhtml`

Here's a simple example of what you can do in an `.xhtml` file:

```html
<!-- Standard HTML tags work as you'd expect -->
<h1>Hello from XHTML!</h1>
<p>This is a standard HTML file with a twist.</p>

<!-- You can write Lua code right in your HTML! -->
<lua>
  -- This code is executed by the runtime
  local message = "Hello from Lua! The current server time is " .. os.date()
  print(message)
</lua>

<!-- You can also include CSS as usual -->
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    text-align: center;
    padding: 2em;
    background-color: #f4f6f8;
  }
  h1 {
    color: #2c3e50;
  }
</style>
```
