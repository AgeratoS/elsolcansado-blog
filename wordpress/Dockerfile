FROM wordpress:6.8

# Labels for GitHub Container Registry
LABEL org.opencontainers.image.source="https://github.com/9d8dev/next-wp"
LABEL org.opencontainers.image.description="WordPress with next-revalidate plugin for headless Next.js"
LABEL org.opencontainers.image.licenses="MIT"

# Install WP-CLI and MySQL client (required by WP-CLI db commands)
RUN apt-get update \
    && apt-get install -y --no-install-recommends default-mysql-client \
    && rm -rf /var/lib/apt/lists/* \
    && curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
    && chmod +x wp-cli.phar \
    && mv wp-cli.phar /usr/local/bin/wp

# Copy plugin and theme to staging location (volume overwrites /var/www/html)
COPY plugin/next-revalidate /usr/src/next-revalidate
COPY wordpress/theme /usr/src/nextjs-headless
COPY wordpress/php/uploads.ini /usr/local/etc/php/conf.d/uploads.ini

# Copy the setup scripts
COPY wordpress/setup.sh /usr/local/bin/setup-wordpress.sh
COPY wordpress/entrypoint.sh /usr/local/bin/custom-entrypoint.sh
RUN chmod +x /usr/local/bin/setup-wordpress.sh /usr/local/bin/custom-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/custom-entrypoint.sh"]
CMD ["apache2-foreground"]
