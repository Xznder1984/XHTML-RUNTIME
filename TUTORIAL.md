# XHTML Runtime Tutorial

Welcome! This tutorial will guide you through building your first **XHTML Runtime** application. We'll cover creating a project, writing some code, and seeing it run.

---

### Step 1: Installation

Before you begin, make sure you have the `xhtml` CLI installed. If you haven't installed it yet, please follow the instructions in the [README.md](README.md) file.

To verify the installation, run:

```bash
xhtml --version
```

This should print the currently installed version number.

---

### Step 2: Creating Your Project

The `xhtml init` command is the starting point for any new project.

1.  Create a new directory for your project and navigate into it:
    ```bash
    mkdir my-first-app
    cd my-first-app
    ```

2.  Run the init command:
    ```bash
    xhtml init
    ```
    The CLI will ask you a few questions about your project. For now, you can just press Enter to accept the defaults. This creates two files:
    -   `index.xhtml`: Your main application file.
    -   `xhtml.json`: Your project's configuration manifest.

---

### Step 3: Running the Development Server

The development server allows you to see your changes in real-time.

Start the server by running:

```bash
xhtml dev
```

Now, open your web browser and go to `http://localhost:3000`. You should see the default "Hello from XHTML!" page.

---

### Step 4: Making Your First Edit

Let's modify the `index.xhtml` file to see the live-reloading in action.

1.  Open `index.xhtml` in your favorite code editor.
2.  Change the `<h1>` tag and add a new Lua print statement.

    ```html
    <h1>My First XHTML App!</h1>
    <p>This is a standard HTML file with a twist.</p>

    <lua>
      -- You can write Lua code right in your HTML!
      print("Hello from Lua! The time is " .. os.date())

      -- Let's add another message
      print("Live-reloading is awesome!")
    </lua>

    <style>
      body {
        font-family: sans-serif;
        text-align: center;
        padding: 2em;
        background-color: #f0f0f0;
      }
      h1 {
        color: #333;
      }
    </style>
    ```

3.  Save the file.

4.  Look at your browser. The page should have automatically updated to show your changes! The new "Live-reloading is awesome!" message will appear in your browser's developer console.

---

### Step 5: Next Steps

You've successfully created and edited your first XHTML Runtime application!

From here, you can explore more advanced topics:

-   **Build for production:** Run `xhtml build` to create a minified `index.html` file that's ready to be deployed to any web server.
-   **Create a desktop app:** Run `xhtml electron` to package your application into a distributable desktop app for Windows, macOS, or Linux.
-   **Explore the runtime API:** (Future feature) The runtime will provide APIs to interact with the file system, make system calls, and more.
