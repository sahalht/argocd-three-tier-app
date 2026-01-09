FROM postgres:15-alpine

# Environment variables for localhost testing
# Override these in production with -e flags or docker-compose
ENV POSTGRES_DB=company_dashboard \
    POSTGRES_USER=postgres \
    POSTGRES_PASSWORD=password123

# Copy initialization SQL
COPY init.sql /docker-entrypoint-initdb.d/

# Health check for container readiness
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
    CMD pg_isready -U postgres -d $POSTGRES_DB || exit 1

# Data volume
VOLUME ["/var/lib/postgresql/data"]

# Expose PostgreSQL port
EXPOSE 5432

