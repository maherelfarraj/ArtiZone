import { Helmet } from '@dr.pogodin/react-helmet';
import ServiceDetailPage from '@/components/ServiceDetailPage';
import { getServiceBySlug } from '@/data/services';

const service = getServiceBySlug('mens-grooming')!;

export default function MensGroomingPage() {
  return (
    <>
      <Helmet>
        <title>{service.seoTitle}</title>
        <meta name="description" content={service.seoDescription} />
        <link rel="canonical" href="https://artizonespa.com/services/mens-grooming" />
      </Helmet>
      <ServiceDetailPage service={service} />
    </>
  );
}
