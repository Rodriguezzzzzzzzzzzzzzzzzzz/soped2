import ChairPanel from '@/src/mun-v2/components/chair/ChairPanel'

export function generateStaticParams() {
  return [
    { committeeId: 'demo-committee-01' },
  ]
}

export default function Page() {
  return <ChairPanel />
}
