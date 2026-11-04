import { auth } from "../lib/auth";
import { db } from "../db";
import { users, invitations, invitationEvents, guests } from "../db/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Seeding test credentials...");

  // 1. Create Couple User
  let coupleUserId: string | null = null;
  try {
    const couple = await auth.api.signUpEmail({
      body: {
        email: "couple@invitation.lk",
        password: "Password123!",
        name: "Dulhani & Nimesh",
      },
    });
    coupleUserId = couple.user.id;
    console.log("Created couple user: couple@invitation.lk (ID:", coupleUserId, ")");
  } catch {
    const existing = await db.query.users.findFirst({
      where: eq(users.email, "couple@invitation.lk"),
    });
    if (existing) {
      coupleUserId = existing.id;
      console.log("Couple user already exists (ID:", coupleUserId, ")");
    }
  }

  // 2. Create Admin User
  let adminUserId: string | null = null;
  try {
    const admin = await auth.api.signUpEmail({
      body: {
        email: "admin@invitation.lk",
        password: "Admin123!",
        name: "Admin Team",
      },
    });
    adminUserId = admin.user.id;
    console.log("Created admin user: admin@invitation.lk (ID:", adminUserId, ")");
  } catch {
    const existing = await db.query.users.findFirst({
      where: eq(users.email, "admin@invitation.lk"),
    });
    if (existing) {
      adminUserId = existing.id;
      console.log("Admin user already exists (ID:", adminUserId, ")");
    }
  }

  // Set isTeam = true for admin
  if (adminUserId) {
    await db.update(users).set({ isTeam: true }).where(eq(users.id, adminUserId));
    console.log("Set isTeam = true for admin@invitation.lk");
  }

  // 3. Attach a sample rich wedding invitation to the couple if none exists
  if (coupleUserId) {
    const existingInvite = await db.query.invitations.findFirst({
      where: eq(invitations.ownerId, coupleUserId),
    });

    if (!existingInvite) {
      const [newInvite] = await db
        .insert(invitations)
        .values({
          ownerId: coupleUserId,
          slug: "dulhani-nimesh-wedding",
          templateSlug: "poruwa-traditional",
          status: "published",
          defaultLocale: "si",
          eventDate: new Date("2026-12-21T09:42:00Z"),
          content: {
            couple: {
              partnerOne: "දුල්හානි",
              partnerTwo: "නිමේෂ්",
              partnerOneParents: "සුනිල් සහ චිත්‍රා පෙරේරා යුවළගේ දියණිය",
              partnerTwoParents: "රංජිත් සහ හේමා ජයවර්ධන යුවළගේ පුත්",
            },
            story: {
              quote: "දෙගුරුන්ගේ ආශිර්වාදයෙන් යුතුව අප දෙදෙනාගේ මංගල දින සැමරුමෙහිදී එක්වන ලෙස ගෞරවයෙන් ආරාධනා කරමු.",
            },
            events: [
              {
                id: "ev-poruwa",
                title: "පොරුව චාරිත්‍රය (Poruwa Ceremony)",
                venue: "The Kingsbury Hotel, Colombo",
                startsAt: "09:42 AM",
                address: "Janadhipathi Mawatha, Colombo 01",
                mapUrl: "https://maps.google.com",
                notes: "සුබ නැකත: පෙ.ව. 09:42 ට",
                sort: 0,
              },
              {
                id: "ev-reception",
                title: "මංගල භෝජන සංග්‍රහය (Reception)",
                venue: "The Balmoral Ballroom, Colombo",
                startsAt: "12:30 PM",
                address: "Janadhipathi Mawatha, Colombo 01",
                mapUrl: "https://maps.google.com",
                notes: "දිවා භෝජනය සහ සුබපැතුම්",
                sort: 1,
              },
            ],
            sections: {
              showCover: true,
              showEvents: true,
              showStory: true,
              showRsvp: true,
              showGifts: false,
            },
          },
          theme: {
            accentColor: "#b45309",
            surfaceColor: "#fcf9f2",
            inkColor: "#2b1c11",
          },
        })
        .returning();

      console.log("Attached sample invitation: dulhani-nimesh-wedding (ID:", newInvite.id, ")");

      // Add Poruwa event
      await db.insert(invitationEvents).values({
        invitationId: newInvite.id,
        title: "පොරුව චාරිත්‍රය",
        startsAt: new Date("2026-12-21T09:42:00Z"),
        venue: "The Kingsbury, Colombo",
        address: "Janadhipathi Mawatha, Colombo 01",
        sortOrder: 0,
      });

      // Add sample guests
      await db.insert(guests).values([
        {
          invitationId: newInvite.id,
          name: "Kasun Jayasuriya",
          partySize: 2,
          phone: "+94771234567",
          token: "kasun-sample-token-128bit",
          deliveryStatus: "delivered",
        },
        {
          invitationId: newInvite.id,
          name: "Dr. & Mrs. Wickramasinghe",
          partySize: 3,
          phone: "+94719876543",
          token: "wickrama-sample-token-128bit",
          deliveryStatus: "delivered",
        },
      ]);
      console.log("Added sample guests to invitation.");
    }
  }

  console.log("\nCredentials Seeded Successfully!");
  console.log("=========================================");
  console.log("Couple / User Login:");
  console.log("  Email:    couple@invitation.lk");
  console.log("  Password: Password123!");
  console.log("-----------------------------------------");
  console.log("Admin / Team Login:");
  console.log("  Email:    admin@invitation.lk");
  console.log("  Password: Admin123!");
  console.log("=========================================\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
