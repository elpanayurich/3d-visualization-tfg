# 3D 6G Cell-Free & RIS Simulation as Visual Support (Vibe-coded)

Interactive 3D visualization of a 6G Cell-Free architecture with RISs. This is a support to visually explain my real TFG.

You can run it online here: https://codesandbox.io/p/sandbox/github/elpanayurich/3d-visualization-tfg

## How to Run Locally (Windows)

If you've just cloned this repository to a Windows laptop, follow these steps to get the 3D simulation running locally.

### 1. Prerequisites

You will need **Node.js** installed on your computer. 
- Download and install the latest LTS version for Windows from the official website: [Node.js Downloads](https://nodejs.org/).
- Verify the installation by opening Command Prompt (`cmd`) or PowerShell and typing:
  ```powershell
  node -v
  npm -v
  ```
  *(Both should return version numbers).*

### 2. Install Dependencies

Open a terminal (PowerShell or Command Prompt) and navigate to the directory where you cloned the project.

```powershell
cd path\to\random_project
```

Then, run the following command to download all the required packages (like Three.js, React, Framer Motion, etc.):

```powershell
npm install
```

### 3. Start the Development Server

Once the installation is complete, you can start the local development server:

```powershell
npm run dev
```

### 4. View the Simulation 

After running the command, Vite will provide a localized URL in your terminal. It will usually look like this:

```
  VITE v5.x.x  ready in 450 ms

  ➜  Local:   http://localhost:5173/
```

Open http://localhost:5173/ and you will be able to see the project.

*Please, this was totally done with the help of AI, don't take this as a real programming project, just as a tool to visualize scenarios in 3D*
