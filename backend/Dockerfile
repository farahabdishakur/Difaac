# syntax=docker/dockerfile:1

FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DIFAAC_DB_PATH=/data/difaac.db

WORKDIR /app

# gcc is needed to build wheels for some dependencies but is not needed at
# runtime, so it is removed in the same layer. Leaving a compiler in a
# production image adds attack surface for no benefit.
COPY requirements.txt .
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc \
    && pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt gunicorn \
    && apt-get purge -y --auto-remove gcc \
    && rm -rf /var/lib/apt/lists/*

COPY . .
RUN chmod +x /app/start.sh

# Run as an unprivileged user. If the application is ever compromised, the
# process should not also hold root inside the container.
RUN useradd --create-home --uid 10001 difaac \
    && mkdir -p /data \
    && chown -R difaac:difaac /app /data
USER difaac

EXPOSE 8000

# Lets the orchestrator restart the container when the app stops responding,
# rather than only when the process exits.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request,sys; sys.exit(0 if urllib.request.urlopen('http://127.0.0.1:8000/health', timeout=4).status == 200 else 1)"

CMD ["/app/start.sh"]
