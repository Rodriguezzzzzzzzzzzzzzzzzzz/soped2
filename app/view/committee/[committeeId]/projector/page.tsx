import ProjectorScreen from '@/src/mun-v2/components/projector/ProjectorScreen'

export function generateStaticParams() {
  return [
    { committeeId: 'demo-committee-01' },
  ]
}

export default function Page({ params }: { params: { committeeId: string } }) {
  return <ProjectorScreen committeeId={params.committeeId} />
}
