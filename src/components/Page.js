import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { forwardRef } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { Box } from '@mui/material';
import { siteMetadata, toAbsoluteUrl } from '../seo/siteMetadata';

// ----------------------------------------------------------------------

const PRIVATE_PATHS = ['/dashboard'];
const AUTH_PATHS = ['/login', '/register', '/forgot-password', '/reset-password'];

function resolveTitle(pageTitle) {
  if (!pageTitle) {
    return siteMetadata.defaultTitle;
  }

  return pageTitle.includes(siteMetadata.siteName) ? pageTitle : `${pageTitle} | ${siteMetadata.siteName}`;
}

const Page = forwardRef(
  (
    {
      children,
      title = '',
      description = siteMetadata.description,
      canonicalPath,
      image,
      meta,
      noIndex,
      schema,
      ...other
    },
    ref
  ) => {
    const { pathname } = useLocation();
    const resolvedPath = canonicalPath || pathname;
    const canonicalUrl = toAbsoluteUrl(resolvedPath);
    const pageTitle = resolveTitle(title);
    const previewImage = toAbsoluteUrl(image || siteMetadata.ogImage);
    const shouldNoIndex =
      typeof noIndex === 'boolean'
        ? noIndex
        : PRIVATE_PATHS.some((prefix) => pathname.startsWith(prefix)) || AUTH_PATHS.includes(pathname);

    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: siteMetadata.siteName,
      url: siteMetadata.siteUrl,
      logo: toAbsoluteUrl('/favicon/android-chrome-512x512.png'),
      sameAs: siteMetadata.socialProfiles,
    };

    return (
      <>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={description} />
          <link rel="canonical" href={canonicalUrl} />
          <meta name="robots" content={shouldNoIndex ? 'noindex,nofollow' : 'index,follow'} />

          <meta property="og:type" content="website" />
          <meta property="og:site_name" content={siteMetadata.siteName} />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={description} />
          <meta property="og:url" content={canonicalUrl} />
          <meta property="og:image" content={previewImage} />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={pageTitle} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={previewImage} />
          {meta}

          <script type="application/ld+json">{JSON.stringify(schema || organizationSchema)}</script>
        </Helmet>

        <Box ref={ref} {...other}>
          {children}
        </Box>
      </>
    );
  }
);

Page.displayName = 'Page';

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  canonicalPath: PropTypes.string,
  image: PropTypes.string,
  meta: PropTypes.node,
  noIndex: PropTypes.bool,
  schema: PropTypes.object,
};

export default Page;
