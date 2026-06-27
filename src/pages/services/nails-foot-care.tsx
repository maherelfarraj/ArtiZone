import { Helmet } from '@dr.pogodin/react-helmet';
import ServiceDetailPage from '@/components/ServiceDetailPage';
import { getServiceBySlug } from '@/data/services';

const service = getServiceBySlug('nails-foot-care')!;

export default function NailsFootCarePage() {
  return (
    <>
      <Helmet>
        <title>{service.seoTitle}</title>
        <meta name="description" content={service.seoDescription} />
        <link rel="canonical" href="https://artizonespa.com/services/nails-foot-care" />
      </Helmet>
      <ServiceDetailPage service={service} />
    </>
  );
}
