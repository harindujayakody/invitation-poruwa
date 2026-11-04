import { redirect } from "next/navigation";

interface InvitationIndexPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function InvitationIndexPage({ params }: InvitationIndexPageProps) {
  const { locale, id } = await params;
  redirect(`/${locale}/app/invitations/${id}/edit`);
}
