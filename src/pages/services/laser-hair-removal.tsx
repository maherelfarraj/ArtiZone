import { Helmet } from '@dr.pogodin/react-helmet';
import ServiceDetailPage from '@/components/ServiceDetailPage';
import { getServiceBySlug } from '@/data/services';

const service = getServiceBySlug('laser-hair-removal')!;

export default function LaserHairRemovalPage() {
  return (
    <>
      <Helmet>
        <title>{service.seoTitle}</title>
        <meta name="description" content={service.seoDescription} />
        <link rel="canonical" href="https://artizonespa.com/services/laser-hair-removal" />
      </Helmet>
      <ServiceDetailPage service={service} />
    </>
  );
}
