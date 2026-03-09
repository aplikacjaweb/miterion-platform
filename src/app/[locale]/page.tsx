import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import SnapshotForm from '@/components/SnapshotForm';
import RfpForm from '@/components/RfpForm';
import DctWaitlistForm from '@/components/DctWaitlistForm';

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Index.metadata' });

  return {
    title: t('title'),
    description: t('description')
  };
}

export default async function Home({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'Index' });

  return (
    <div className="space-y-24 py-12">
      <section className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {t('hero.title')}
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {t('hero.subtitle')}
        </p>
      </section>

      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">
              {t('valueProps.competition.title')}
            </h3>
            <p className="text-gray-600">
              {t('valueProps.competition.description')}
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">
              {t('valueProps.density.title')}
            </h3>
            <p className="text-gray-600">
              {t('valueProps.density.description')}
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">
              {t('valueProps.feasibility.title')}
            </h3>
            <p className="text-gray-600">
              {t('valueProps.feasibility.description')}
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="section-title">{t('snapshot.title')}</h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          {t('snapshot.description')}
        </p>
        <SnapshotForm />
      </section>

      <section className="container mx-auto px-4">
        <h2 className="section-title">{t('rfp.title')}</h2>
        <p className="text-center text-gray-600 mb-2 max-w-2xl mx-auto">
          {t('rfp.description')}
        </p>
        <p className="text-center text-sm text-teal mb-8">
          {t('rfp.pricing')}
        </p>
        <div className="max-w-xl mx-auto">
          <RfpForm />
        </div>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="section-title">{t('dct.title')}</h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          {t('dct.description')}
        </p>
        <div className="max-w-xl mx-auto">
          <DctWaitlistForm />
        </div>
      </section>
    </div>
  );
}
