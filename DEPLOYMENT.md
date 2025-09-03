# Deployment Checklist for Production

## Pre-Deployment Security & Optimization

### ✅ Code Quality
- [ ] All TypeScript errors resolved (`npm run type-check`)
- [ ] All ESLint warnings/errors fixed (`npm run lint`)
- [ ] Build successfully completes (`npm run build`)
- [ ] No console.log statements in production code
- [ ] All TODO comments addressed or documented

### ✅ Environment Variables
- [ ] All required environment variables documented in `.env.example`
- [ ] Production environment variables configured in Vercel
- [ ] No hardcoded secrets in codebase
- [ ] `NEXT_PUBLIC_APP_URL` set to production domain
- [ ] Database URLs point to production Supabase project

### ✅ Database Security
- [ ] All RLS policies properly configured and tested
- [ ] Database migration scripts run successfully
- [ ] No test data in production database
- [ ] Database backups configured
- [ ] Connection limits configured appropriately

### ✅ Authentication
- [ ] Google OAuth configured for production domain
- [ ] Callback URLs updated for production
- [ ] Session security configured properly
- [ ] User registration flow tested end-to-end

### ✅ Performance Optimization
- [ ] Image optimization configured (`next/image`)
- [ ] Bundle size analyzed (`npm run analyze`)
- [ ] Lighthouse scores > 90 for all pages
- [ ] Loading states implemented for all async operations
- [ ] Error boundaries implemented

### ✅ Security Headers
- [ ] CSP (Content Security Policy) configured
- [ ] HTTPS enforced
- [ ] Security headers configured in `next.config.mjs`
- [ ] Rate limiting implemented for API routes

## Vercel Deployment Setup

### ✅ Repository Setup
- [ ] Repository is public/accessible to Vercel
- [ ] Main branch is set as production branch
- [ ] All sensitive files in `.gitignore`
- [ ] README.md is comprehensive and up-to-date

### ✅ Vercel Project Configuration
1. **Import Repository**
   - [ ] Connect GitHub repository to Vercel
   - [ ] Set build command: `npm run build`
   - [ ] Set output directory: `.next`
   - [ ] Set install command: `npm install --legacy-peer-deps`

2. **Environment Variables**
   ```bash
   # Required Production Variables
   NEXT_PUBLIC_APP_URL=https://yourdomain.vercel.app
   NODE_ENV=production
   NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
   GOOGLE_CLIENT_ID=your-production-google-client-id
   GOOGLE_CLIENT_SECRET=your-production-google-client-secret
   JWT_SECRET=your-production-jwt-secret
   CSRF_SECRET=your-production-csrf-secret
   COOKIE_SECRET=your-production-cookie-secret
   ```

3. **Domain Configuration**
   - [ ] Custom domain configured (optional)
   - [ ] SSL certificate automatically provisioned
   - [ ] Domain redirects configured if needed

### ✅ Supabase Production Setup
1. **Database**
   - [ ] Production project created
   - [ ] Database schema deployed (`database-minimal-setup.sql`)
   - [ ] RLS policies enabled and tested
   - [ ] Triggers and functions deployed

2. **Authentication**
   - [ ] Google OAuth provider configured
   - [ ] Allowed callback URLs updated
   - [ ] Email templates customized (optional)
   - [ ] User confirmation settings configured

3. **Storage** (if using)
   - [ ] Buckets created and configured
   - [ ] Storage policies implemented
   - [ ] CDN enabled for performance

### ✅ Google Cloud Console Setup
1. **OAuth Configuration**
   - [ ] Production OAuth client created
   - [ ] Authorized JavaScript origins: `https://yourdomain.vercel.app`
   - [ ] Authorized redirect URIs: `https://yourdomain.vercel.app/api/auth/callback/google`
   - [ ] OAuth consent screen configured for production

## Post-Deployment Verification

### ✅ Functional Testing
- [ ] User registration works end-to-end
- [ ] Google OAuth login/logout functions
- [ ] All major user flows tested
- [ ] Database operations working correctly
- [ ] File uploads working (if applicable)

### ✅ Performance Testing
- [ ] Page load times < 3 seconds
- [ ] Lighthouse performance score > 90
- [ ] Mobile responsiveness verified
- [ ] Core Web Vitals within thresholds

### ✅ Security Testing
- [ ] HTTPS enforced everywhere
- [ ] Security headers present
- [ ] No sensitive data exposed in client
- [ ] Authentication boundaries respected
- [ ] Rate limiting functional

### ✅ Monitoring Setup
- [ ] Error tracking configured (Sentry recommended)
- [ ] Performance monitoring enabled
- [ ] Database monitoring configured
- [ ] Uptime monitoring setup

## Go-Live Checklist

### ✅ Documentation
- [ ] README.md updated with production info
- [ ] API documentation complete
- [ ] User guides created
- [ ] Admin documentation provided

### ✅ Communication
- [ ] Stakeholders notified of go-live
- [ ] Support team briefed
- [ ] User onboarding materials ready
- [ ] Rollback plan documented

### ✅ Final Checks
- [ ] All tests pass in production environment
- [ ] Backup and recovery procedures tested
- [ ] SSL certificate valid and properly configured
- [ ] DNS configuration correct
- [ ] CDN configured for static assets

## Post-Launch Monitoring

### First 24 Hours
- [ ] Monitor error rates
- [ ] Watch performance metrics
- [ ] Check user registration flow
- [ ] Verify database performance
- [ ] Monitor server resources

### First Week
- [ ] Review user feedback
- [ ] Monitor usage patterns
- [ ] Check for any performance issues
- [ ] Review security logs
- [ ] Plan first updates

## Emergency Procedures

### Rollback Plan
1. **Immediate Issues**
   - [ ] Revert to previous Vercel deployment
   - [ ] Switch DNS if needed
   - [ ] Notify users of maintenance

2. **Database Issues**
   - [ ] Have database backup ready
   - [ ] Know how to restore quickly
   - [ ] Have emergency contact for database admin

### Support Contacts
- **Technical Lead**: [Your contact info]
- **Database Admin**: [Database admin contact]
- **Security Officer**: [Security contact]
- **Vercel Support**: [Vercel support info]

---

✅ **All items checked? Ready for production deployment!**

Remember: Always test in a staging environment that mirrors production before deploying!
