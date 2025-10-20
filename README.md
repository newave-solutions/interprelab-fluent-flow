# Interprelab Eco Landing Page

[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![shadcn-ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcn-ui&logoColor=white)](https://ui.shadcn.com/)

Eco-focused landing page for Interprelab, built with Vite, React, TypeScript, Tailwind CSS, and shadcn-ui.

## Table of Contents

- [About The Project](#about-the-project)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## About The Project

This project is a modern, responsive, and eco-focused landing page for Interprelab. It is designed to be a starting point for building a complete marketing website.

Built with a focus on modularity and maintainability, the project uses a combination of modern web technologies:

- **Vite:** A next-generation front-end tooling that provides a faster and leaner development experience.
- **React:** A JavaScript library for building user interfaces.
- **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **shadcn-ui:** A collection of re-usable components that can be easily customized.

## Features

- **Responsive Design:** The landing page is fully responsive and works on all devices.
- **Component-Based Architecture:** The project is built using a component-based architecture, making it easy to reuse and maintain code.
- **Routing:** The project uses React Router for client-side routing.
- **Modular Components:** The project includes a set of modular and reusable components.
- **Customizable Theme:** The project uses Tailwind CSS and shadcn-ui, making it easy to customize the theme.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username_/interprelab-eco-landing-page.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Start the development server
    ```sh
    npm run dev
    ```

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in the development mode.
- `npm run build`: Builds the app for production to the `dist` folder.
- `npm run build:dev`: Builds the app for development to the `dist` folder.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run preview`: Serves the production build locally for preview.

## Project Structure

- `src/pages/`: Page components
- `src/components/`: Shared UI components
- `src/components/ui/`: shadcn-ui style components
- `src/hooks/`: Custom hooks
- `src/lib/`: Utilities
- `src/assets/`: Images and static files
- `public/`: Static files

## Deployment

This project can be deployed to any static site hosting service. For detailed instructions on deploying to Google Cloud Run, see `GCP_CLOUDRUN_DEPLOY.md`.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please refer to the `.github/copilot-instructions.md` file for detailed contribution guidelines.

## License

Distributed under the MIT License. See `LICENSE` for more information.
