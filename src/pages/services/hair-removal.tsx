import { Helmet } from '@dr.pogodin/react-helmet';
import ServiceDetailPage from '@/components/ServiceDetailPage';
import { getServiceBySlug } from '@/data/services';

const service = getServiceBySlug('hair-removal')!;

export default function HairRemovalPage() {
  return (
    <>
      <Helmet>
        <title>{service.seoTitle}</title>
        <meta name="description" content={service.seoDescription} />
        <link rel="canonical" href="https://artizonespa.com/services/hair-removal" />
      </Helmet>
      <ServiceDetailPage service={service} />
    </>
  );
}
