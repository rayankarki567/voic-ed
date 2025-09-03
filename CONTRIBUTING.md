# Contributing to Student E-Governance System

Thank you for your interest in contributing to the Student E-Governance System! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

1. **Search existing issues** to avoid duplicates
2. **Use issue templates** when available
3. **Provide detailed information**:
   - Clear description of the issue
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (browser, OS, etc.)

### Suggesting Features

1. **Check existing feature requests** first
2. **Describe the feature** clearly and completely
3. **Explain the use case** and benefits
4. **Consider implementation complexity**

### Code Contributions

#### Getting Started

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/yourusername/student-governance-system.git
   cd student-governance-system
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up environment**:
   ```bash
   cp .env.example .env.local
   # Fill in your environment variables
   ```

5. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

#### Development Guidelines

##### Code Style
- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the project's ESLint configuration
- **Prettier**: Code formatting is handled automatically
- **Naming**: Use descriptive, camelCase names for variables and functions

##### Component Guidelines
- **Functional Components**: Use functional components with hooks
- **Props Interface**: Define TypeScript interfaces for all props
- **Accessibility**: Ensure components are accessible (ARIA labels, keyboard navigation)
- **Responsive**: Design mobile-first with responsive breakpoints

##### Database Guidelines
- **RLS Policies**: All tables must have appropriate Row Level Security policies
- **Migrations**: Database changes must be properly documented
- **Type Safety**: Use generated types from Supabase

#### Testing
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Fix linting issues
npm run lint:fix
```

#### Commit Guidelines

Follow conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

**Examples:**
```
feat(petitions): add signature verification
fix(auth): resolve Google OAuth callback error
docs(readme): update installation instructions
```

#### Pull Request Process

1. **Update your branch** with the latest changes from main:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Ensure all checks pass**:
   ```bash
   npm run check
   npm run build
   ```

3. **Create a pull request** with:
   - Clear title and description
   - Reference to related issues
   - Screenshots for UI changes
   - Breaking changes documentation

4. **Respond to feedback** promptly and make requested changes

## 📋 Development Setup

### Required Tools
- Node.js 18+
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Recommended VS Code Extensions
- TypeScript Hero
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- GitLens

### Project Structure
```
├── app/                    # Next.js App Router pages
├── components/            # Reusable UI components
├── lib/                  # Utility functions and configs
├── hooks/                # Custom React hooks
├── types/                # TypeScript definitions
├── public/               # Static assets
└── styles/               # Global styles
```

## 🔒 Security Guidelines

### Environment Variables
- **Never commit** `.env` files
- **Use `.env.example`** to document required variables
- **Validate all inputs** on both client and server
- **Use environment-specific** configurations

### Authentication
- **Test authentication flows** thoroughly
- **Follow OAuth best practices**
- **Implement proper session management**
- **Use HTTPS** in production

### Data Privacy
- **Implement proper RLS policies**
- **Validate user permissions** for all operations
- **Sanitize user inputs** to prevent XSS
- **Follow GDPR principles** where applicable

## 🐛 Bug Reports

### Before Reporting
- Update to the latest version
- Search existing issues
- Try to reproduce the issue

### Bug Report Template
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. iOS]
- Browser [e.g. chrome, safari]
- Version [e.g. 22]
```

## 🚀 Release Process

1. **Version bumping** follows semantic versioning (semver)
2. **Changelog** is updated for each release
3. **Testing** on staging environment before production
4. **Deployment** through Vercel's automated pipeline

## 📞 Getting Help

- **GitHub Discussions** for general questions
- **GitHub Issues** for bugs and feature requests
- **Documentation** in the project wiki
- **Code review** feedback for learning

## 🙏 Recognition

Contributors will be acknowledged in:
- README.md contributors section
- Release notes for significant contributions
- Project documentation

Thank you for contributing to student empowerment and democratic engagement! 🎓
