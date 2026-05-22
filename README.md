# Luminary — Photo Album Management

A production-ready Photo Album Management web application built with Django, Cloudinary, and deployed on Render.

---

## Features

- **Photo Album Management** — Create, edit, and delete albums with public, unlisted, or private visibility
- **Photo Uploads** — Upload multiple photos at once with optional captions and taken-on dates
- **Role-Based Access Control (RBAC)** — Fine-grained permissions with four roles: Owner, Admin, Contributor, and Viewer
- **Collaborator System** — Invite users to albums with specific roles
- **Cloud Storage** — All images stored on Cloudinary (no local media storage in production)
- **Public Gallery** — Browse all public albums on the homepage with search and pagination
- **User Dashboard** — Manage your albums and view collaboration invites
- **User Profiles** — View account stats, owned albums, and activity
- **Album Cover** — Set any photo as the album cover
- **Photo Navigation** — Previous/next navigation inside album photo viewer
- **Toast Notifications** — Real-time feedback for all actions
- **Responsive Design** — Mobile-friendly dark theme UI

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Django 5.2 |
| Database (dev) | SQLite |
| Database (prod) | PostgreSQL (Render) |
| Media Storage | Cloudinary |
| Static Files | WhiteNoise |
| Web Server | Gunicorn |
| Deployment | Render |
| Frontend | Vanilla CSS + JS (DM Sans font) |

---

## Role-Based Access Control

| Permission | Owner | Admin | Contributor | Viewer |
|---|---|---|---|---|
| View album | ✅ | ✅ | ✅ | ✅ |
| Upload photos | ✅ | ✅ | ✅ | ❌ |
| Edit/delete photos | ✅ | ✅ | ✅ | ❌ |
| Edit album details | ✅ | ✅ | ❌ | ❌ |
| Delete album | ✅ | ✅ | ❌ | ❌ |
| Manage collaborators | ✅ | ✅ | ❌ | ❌ |
| Set album cover | ✅ | ✅ | ❌ | ❌ |

---

## Project Structure

```
luminary/
├── luminary_project/        # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── albums/                  # Main app
│   ├── models.py            # Album, Photo, Collaborator models
│   ├── views.py             # Class-Based Views (CBVs)
│   ├── forms.py             # AlbumForm, PhotoUploadForm, PhotoEditForm
│   ├── urls.py
│   └── admin.py
├── accounts/                # Auth app
│   ├── views.py             # Register, Login, Profile views
│   ├── forms.py             # RegisterForm, CustomAuthenticationForm
│   └── urls.py
├── templates/
│   ├── base.html
│   ├── albums/
│   │   ├── home.html
│   │   ├── dashboard.html
│   │   ├── album_detail.html
│   │   ├── album_form.html
│   │   ├── album_confirm_delete.html
│   │   ├── photo_detail.html
│   │   ├── photo_form.html
│   │   └── photo_confirm_delete.html
│   └── accounts/
│       ├── login.html
│       ├── register.html
│       └── profile.html
├── static/
│   ├── css/main.css
│   ├── js/main.js
│   └── images/logo.png
├── manage.py
├── requirements.txt
├── build.sh
└── .env
```

---

## Local Development Setup

### Prerequisites
- Python 3.11+
- Git
- A [Cloudinary](https://cloudinary.com) account (free tier works)

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/luminary.git
cd luminary
```

**2. Create and activate virtual environment**
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

**3. Install dependencies**
```bash
pip install -r requirements.txt
```

**4. Create your `.env` file**
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@example.com
DJANGO_SUPERUSER_PASSWORD=admin1234
```

**5. Run migrations**
```bash
python manage.py makemigrations
python manage.py migrate
```

**6. Create a superuser**
```bash
python manage.py createsuperuser
```

**7. Run the development server**
```bash
python manage.py runserver
```

Visit `http://127.0.0.1:8000` in your browser.

---

## Deployment (Render)

### Environment Variables (set in Render dashboard)

| Key | Value |
|---|---|
| `SECRET_KEY` | Your production secret key |
| `DEBUG` | `False` |
| `ALLOWED_HOSTS` | `your-app.onrender.com` |
| `DATABASE_URL` | PostgreSQL URL from Render |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |
| `DJANGO_SUPERUSER_USERNAME` | `admin` |
| `DJANGO_SUPERUSER_EMAIL` | Your email |
| `DJANGO_SUPERUSER_PASSWORD` | Strong password |

### Build & Start Commands

| Setting | Value |
|---|---|
| Build Command | `./build.sh` |
| Start Command | `gunicorn luminary_project.wsgi:application` |

### Generate a secure SECRET_KEY
```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

---

## Models

### Album
- `owner` — ForeignKey to User
- `title` — CharField
- `description` — TextField
- `visibility` — public / unlisted / private
- `cover_photo` — ForeignKey to Photo
- `collaborators` — ManyToManyField through Collaborator

### Photo
- `album` — ForeignKey to Album
- `uploaded_by` — ForeignKey to User
- `image` — CloudinaryField
- `caption` — CharField
- `taken_at` — DateField
- `uploaded_at` — DateTimeField

### Collaborator
- `album` — ForeignKey to Album
- `user` — ForeignKey to User
- `role` — viewer / contributor / admin

---

## Architecture

This project follows Django best practices:

- **Class-Based Views (CBVs)** — All views use Django's generic CBVs (`ListView`, `DetailView`, `CreateView`, `UpdateView`, `DeleteView`, `TemplateView`)
- **Mixins for RBAC** — `LoginRequiredMixin`, `UserPassesTestMixin`, and custom mixins (`AlbumAdminMixin`, `AlbumContributorMixin`) enforce permissions at the view level
- **Cloudinary for all media** — `CloudinaryField` on the `Photo` model with `MediaCloudinaryStorage` backend; no local media in production
- **Environment-based config** — All secrets and credentials are loaded from environment variables via `python-dotenv`

---

## License

This project was built as an academic requirement for BSIT at EVSU.
