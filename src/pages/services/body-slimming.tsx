import { Helmet } from '@dr.pogodin/react-helmet';
import ServiceDetailPage from '@/components/ServiceDetailPage';
import { getServiceBySlug } from '@/data/services';

const service = getServiceBySlug('body-slimming')!;

export default function BodySlimmingPage() {
  return (
    <>
      <Helmet>
        <title>{service.seoTitle}</title>
        <meta name="description" content={service.seoDescription} />
        <link rel="canonical" href="https://artizonespa.com/services/body-slimming" />
      </Helmet>
      <ServiceDetailPage service={service} />
    </>
  );
}
