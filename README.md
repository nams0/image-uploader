# اشتراک پیک | SharePic

A modern Persian (Farsi) image sharing and album management web application built with React and Redux.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-Latest-purple?logo=vite)
![Redux](https://img.shields.io/badge/Redux_Toolkit-Latest-764ABC?logo=redux)

## Features

- **User Authentication** - Secure signup and login with validation
- **Drag & Drop Upload** - Intuitive image upload with drag and drop support
- **Album Management** - Automatic album creation for uploaded images
- **Shareable Links** - Generate unique links to share albums with others
- **Download Images** - Download individual images or entire albums
- **Delete Albums** - Album owners can delete their albums
- **Persian Language** - Full RTL support with Persian UI
- **Responsive Design** - Works seamlessly on all devices
- **Real-time Preview** - Preview images before and after upload
- **Smooth Animations** - Beautiful UI animations with Framer Motion

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Library |
| **Vite** | Build Tool & Dev Server |
| **Redux Toolkit** | State Management |
| **React Router DOM** | Client-side Routing |
| **CSS Modules** | Styling |
| **Axios** | HTTP Client |
| **Framer Motion** | Animations |
| **React Dropzone** | File Upload |
| **React Icons** | Icon Library |
| **js-cookie** | Cookie Management |

## Backend

The backend API is running locally on my PC at `http://localhost:5000`.

Authentication is handled via JWT tokens stored in cookies (`auth-token`).

## Upload Constraints

| Constraint | Value |
|------------|-------|
| Max file size | 3 MB |
| Supported formats | JPEG, JPG, PNG, GIF, BMP, WebP |

## Usage

### For Users

1. **Sign Up** - Create a new account with username, email, and password
2. **Log In** - Access your account
3. **Upload Images** - Drag and drop or click to select images
4. **Share Album** - Copy the generated album link
5. **Download** - Download individual images or all at once

### For Album Viewers

1. Open the shared album link
2. View all images in the album
3. Download images individually or all together

## Form Validation

### Signup Validation
- Username: English letters, numbers, and underscores only
- Email: Valid email format required
- Password: Minimum 8 characters with:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- Confirm Password: Must match password

### Login Validation
- Email: Required
- Password: Required

## Styling

The project uses CSS Modules for component-scoped styling, providing clean and maintainable styles for each component.

## State Management

Redux Toolkit manages the upload state with the following structure:

```javascript
{
  uploader: {
    uploading: boolean,      // Upload in progress
    uploaded: boolean,       // Upload completed
    fileUrls: string[],      // Uploaded image URLs
    downloadUrls: string[],  // Download URLs
    fileInfos: object[],     // File metadata
    error: string,           // Error messages
    uploadProgress: object   // Progress per file
  }
}
```

<p align="center">
  Made with ❤️ by <a href="https://github.com/nams0">Namso</a>
</p>