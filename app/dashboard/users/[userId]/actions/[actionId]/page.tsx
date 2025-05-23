import { authWithOrgSubscription } from "@/app/dashboard/auth";
import { redirect, notFound } from "next/navigation";
import { Metadata } from "next";
import { UserActionDetail } from "./user-action";
import db from "@/db";
import * as schema from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { formatUserRecord } from "@/lib/user-record";

export async function generateMetadata({ params }: { params: Promise<{ actionId: string }> }): Promise<Metadata> {
  const { orgId } = await authWithOrgSubscription();

  const id = (await params).actionId;

  const userAction = await db.query.userActions.findFirst({
    where: and(eq(schema.userActions.clerkOrganizationId, orgId), eq(schema.userActions.id, id)),
    with: {
      userRecord: true,
    },
  });

  if (!userAction) {
    return notFound();
  }

  return {
    title: `${formatUserRecord(userAction.userRecord)} | User action | Iffy`,
  };
}

export default async function UserActionPage({ params }: { params: Promise<{ actionId: string }> }) {
  const { orgId } = await authWithOrgSubscription();

  const id = (await params).actionId;

  return <UserActionDetail clerkOrganizationId={orgId} id={id} />;
}
