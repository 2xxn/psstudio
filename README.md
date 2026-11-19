# PSStudio

**PSStudio** is a professional management tool for Google Street View Photospheres. It provides a streamlined interface for uploading, editing, and managing your 360° photos on Google Maps.

![PSStudio Preview](public/preview.png)
*Dashboard View*

![PSStudio Editor](public/preview2.png)
*Upload PhotoSphere View*

## Features

-   **Google OAuth Integration**: Securely log in with your Google account to access your Street View content.
-   **Photosphere Management**:
    -   **Upload**: Easily upload 360° photos with metadata.
    -   **List**: View all your published photospheres in a grid layout.
    -   **View**: Interactive 360° viewer to inspect your photos.
    -   **Edit Location**: Update the GPS coordinates (latitude/longitude) of your photospheres using an interactive map.
    -   **Delete**: Remove photospheres from Google Street View.
-   **Map Integration**: Visual map editor for precise location adjustments.
-   **Toast Notifications**: Real-time feedback for all actions using `react-hot-toast`.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: TypeScript
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [Radix UI](https://www.radix-ui.com/) / [shadcn/ui](https://ui.shadcn.com/)
-   **Maps**: [Leaflet](https://leafletjs.com/) with [React Leaflet](https://react-leaflet.js.org/)
-   **Authentication**: Google OAuth 2.0
-   **State Management**: React Hooks
-   **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

-   Node.js 22.23.5+, 24.22.3+, or 26.13.1+ (Node 20 is EOL)
-   npm
-   A Google Cloud Platform project with the **Street View Publish API** enabled.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/2xxn/psstudio.git
    cd psstudio
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    Create a `.env.local` file in the root directory and add the following variables:

    ```env
    # Google OAuth Credentials
    X_CLIENT_ID=your_google_client_id
    X_CLIENT_SECRET=your_google_client_secret
    REDIRECT_URI=http://localhost:3000/api/auth

    # Encryption Key (32 bytes for AES-256)
    CBC_KEY=your_32_byte_random_string

    # Optional
    NEXT_PUBLIC_API_URL=/api
    ```

### Running the Application

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

To build the application for production:

```bash
npm run build
npm start
```

The production build uses Webpack because the FreeBSD host does not support Turbopack's native bindings. Turbopack remains available for local development on supported platforms.

## Analytics

The hosted instance uses [Umami Cloud](https://umami.is) to collect anonymous page views and product events: logins, photosphere uploads, edits, deletes, and share-link copies. Umami is cookieless and receives no Google account data, photo content, photo locations, or OAuth tokens.

The tracker is restricted to `photosphere.2xxn.dev` via `data-domains`, so self-hosted forks do not send analytics. To use your own Umami instance:

```env
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your_website_id
NEXT_PUBLIC_UMAMI_SRC=https://your-umami.example.com/script.js
NEXT_PUBLIC_UMAMI_DOMAINS=your-domain.example.com
```

To disable analytics entirely, set `NEXT_PUBLIC_UMAMI_WEBSITE_ID=""` or remove the `<Script>` block in `app/layout.tsx`. These are build-time variables.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
