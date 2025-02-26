import UserProfile from '@/components/taskcomponents/UserProfile'

export default function UserProfilePage({ params }: { params: { userId: string } }) {
  return <UserProfile userId={params.userId} />
} 