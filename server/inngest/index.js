// inngest/index.js
import { Inngest } from 'inngest';
import connectDB from '../config/db.js';
import User from '../models/user.js';
import Connection from '../models/Connection.js';
import sendEmail from '../config/nodeMailer.js';

export const inngest = new Inngest({ id: 'pingup-app' });

const syncUserCreation = inngest.createFunction(
  { id: 'sync-user-from-clerk' },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    await connectDB();
    console.log('📥 clerk/user.created payload:', event.data);

    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    let username = email_addresses?.[0]?.email_address?.split('@')?.[0] || `user_${id.slice(-6)}`;

    // ensure unique username
    const exists = await User.findOne({ username });
    if (exists) username = `${username}${Math.floor(Math.random() * 10000)}`;

    try {
      await User.create({
        _id: id,
        email: email_addresses[0].email_address,
        full_name: `${first_name} ${last_name}`,
        profile_picture: image_url,
        username,
      });
      console.log('✅ User created in DB:', id);
    } catch (err) {
      console.error('❌ Error creating user:', err);
      // Helpful for unique constraint collisions
      if (err?.code === 11000) {
        console.error('Duplicate key error on username or _id');
      }
      throw err;
    }
  }
);

const syncUserUpdation = inngest.createFunction(
  { id: 'update-user-from-clerk' },
  { event: 'clerk/user.updated' },
  async ({ event }) => {
    await connectDB();
    console.log('📥 clerk/user.updated payload:', event.data);

    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const updated = {
      email: email_addresses?.[0]?.email_address,
      full_name: `${first_name} ${last_name}`,
      profile_picture: image_url,
    };

    try {
      await User.findByIdAndUpdate(id, updated, { new: true });
      console.log('✅ User updated in DB:', id);
    } catch (err) {
      console.error('❌ Error updating user:', err);
      throw err;
    }
  }
);

const syncUserDeletion = inngest.createFunction(
  { id: 'delete-user-with-clerk' },
  { event: 'clerk/user.deleted' },
  async ({ event }) => {
    await connectDB();
    console.log('📥 clerk/user.deleted payload:', event.data);

    const { id } = event.data;
    try {
      await User.findByIdAndDelete(id);
      console.log('✅ User deleted from DB:', id);
    } catch (err) {
      console.error('❌ Error deleting user:', err);
      throw err;
    }
  }
);

// inngest function to send a reminder when a new connection request is send 
const sendNewConnectionRequestReminder = inngest.createFunction(
  { id: "send-new-connection-request-reminder" },
  { event: "app/connection-request" },
  async ({ event, step }) => {
    const { connectionId } = event.data



    await step.run('send-connection-request-mail', async () => {
      const connection = await Connection.findById(connectionId).populate('from_user_id to_user-id');


      const subject = `👋 New Connection Request`
      const body = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; color: #1f2937;">
    <h2 style="color: #4f46e5; text-align: center; font-size: 22px;">👋 Hi ${connection.to_user_id.full_name},</h2>
    
    <p style="font-size: 16px; line-height: 1.5; margin-top: 20px;">
      You have a new <strong style="color:#111827;">connection request</strong> from 
      <span style="color: #4f46e5; font-weight: bold;">${connection.from_user_id.full_name}</span> 
      (<span style="color:#6b7280;">@${connection.from_user_id.username}</span>).
    </p>

    <p style="margin-top: 20px; font-size: 16px;">
      Click the button below to <strong>accept</strong> or <strong>reject</strong> this request:
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.FRONTEND_URL}/connections" 
         style="background: #4f46e5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">
        View Connection Request
      </a>
    </div>

    <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
      Thanks,<br/>
      <span style="color: #111827; font-weight: bold;">PingUp (Subharthy)</span> – Stay Connected ✨
    </p>
  </div>
`;


      await sendEmail({
        to: connection.to_user_id.email,
        subject,
        body
      })

    })



    const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await step.sleepUntil("wait-for-24-hours", in24Hours)

    
    await step.run('send-connection-request-reminder', async () => {
      const connection = await Connection.findById(connectionId).populate('from_user_id to_user-id');

      if (connection.status === "accepted") {
        return { message: "Already Accepted" }
      }
      const subject = `👋 New Connection Request`
      const body = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; color: #1f2937;">
    <h2 style="color: #4f46e5; text-align: center; font-size: 22px;">👋 Hi ${connection.to_user_id.full_name},</h2>
    
    <p style="font-size: 16px; line-height: 1.5; margin-top: 20px;">
      You have a new <strong style="color:#111827;">connection request</strong> from 
      <span style="color: #4f46e5; font-weight: bold;">${connection.from_user_id.full_name}</span> 
      (<span style="color:#6b7280;">@${connection.from_user_id.username}</span>).
    </p>

    <p style="margin-top: 20px; font-size: 16px;">
      Click the button below to <strong>accept</strong> or <strong>reject</strong> this request:
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.FRONTEND_URL}/connections" 
         style="background: #4f46e5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">
        View Connection Request
      </a>
    </div>

    <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
      Thanks,<br/>
      <span style="color: #111827; font-weight: bold;">PingUp (Subharthy)</span> – Stay Connected ✨
    </p>
  </div>
`;


      await sendEmail({
        to: connection.to_user_id.email,
        subject,
        body
      })

    })
    return {message:"Reminder Send"}

  }
)

export const functions = [syncUserCreation, syncUserUpdation, syncUserDeletion,sendNewConnectionRequestReminder];
