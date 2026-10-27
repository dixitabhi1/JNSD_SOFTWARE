# JNSD EDUCATION CENTRE — DEPLOYMENT & OPERATIONS RUNBOOK

This document details the configuration, deployment lifecycle, database migration procedure, disaster recovery, and GitHub release automation for the JNSD Education Centre School ERP.

---

## 1. Environment Architecture

### Environment A: Development (Local)
- Local Vite dev server on `http://localhost:5173`.
- In-memory/localStorage persistent store with comprehensive mock seed data.
- Full offline testing and pairing capabilities.
- Zero risk of exposing real student Aadhaar or financial records.

### Environment B: Staging
- Automated preview deployments on pull requests.
- Separate staging database instance in Supabase / PostgreSQL.
- Test coverage and authorization regression validation.
- Manager Sir and Principal acceptance testing.

### Environment C: Production
- Live HTTPS website on school custom domain.
- Production PostgreSQL cluster with enforced Row Level Security (RLS) policies.
- Encrypted file storage for student documents.
- Daily automated snapshots and point-in-time recovery.
- Authenticated release APK distribution via GitHub Releases.

---

## 2. Database Migration Runbook

Database migrations are version-controlled in `supabase/migrations/`.

### Migration Execution Procedure:
1. Ensure the PostgreSQL connection string or Supabase CLI is authenticated:
   ```bash
   npx supabase link --project-ref your-project-id
   ```
2. Apply pending migrations:
   ```bash
   npx supabase db push
   ```
3. Verify applied migrations:
   ```bash
   npx supabase migration list
   ```
4. Verify RLS policies are enabled on all 16 tables:
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
   ```

---

## 3. Production Deployment Step-by-Step

1. **Verify Release Gate:**
   - Execute all unit and integration tests: `npm test`.
   - Execute production bundle build: `npm run build`.
   - Confirm zero authorization leaks (Verify Principal and Teacher cannot query `fee_invoices` or `payments`).
2. **Review Environment Configuration:**
   - Copy `.env.example` to `.env.production` on the production host.
   - Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. **Deploy Web Application:**
   - Build assets: `npm run build`.
   - Host `dist/` directory behind an HTTPS reverse proxy (e.g., NGINX, Cloudflare, Vercel, or Netlify).
4. **Android APK Release:**
   - Create a version tag (e.g. `git tag v1.0.0 && git push origin v1.0.0`).
   - The GitHub Actions workflow `.github/workflows/release-apk.yml` builds the APK, verifies SHA-256 checksums, and attaches the binary to the GitHub Release.
   - Update `public/version-manifest.json` with the new download URL and checksum.

---

## 4. Backup, Disaster Recovery & Rollback

### Automated Database Backups
- Supabase automatically takes daily backups with 7 to 30 days retention.
- Manual immediate backup command:
  ```bash
  pg_dump -h db.your-project.supabase.co -U postgres -d postgres -F c -b -v -f jnsd_backup_$(date +%Y%m%d_%H%M%S).dump
  ```

### Database Restoration Procedure
In the event of accidental data corruption:
1. Put the application in maintenance mode.
2. Terminate active database connections.
3. Restore from the latest verified backup:
   ```bash
   pg_restore -h db.your-project.supabase.co -U postgres -d postgres -v -c jnsd_backup_YYYYMMDD.dump
   ```
4. Re-run verification test suite against the restored database.
5. Restore user traffic.

### Application Rollback Runbook
If an update introduces unexpected behavior:
1. **Web:** Roll back the web hosting deployment to the previous immutable release commit immediately.
2. **Database:** If a migration was applied, evaluate backward compatibility. Do not roll back migrations if new data was written; apply a forward-fixing migration instead.
3. **Android APK:** Notify users via the In-App Update screen that a patch update is in progress. The application manifest allows forcing or revoking specific versions.

