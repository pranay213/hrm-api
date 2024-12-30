import { Schema, model, Document } from 'mongoose';

interface ISession extends Document {
  admin_id: Schema.Types.ObjectId;
  user_id: Schema.Types.ObjectId;
  socket_io_id?: string;
  ip_address: string;
  user_agent: string;
  device: string;
  login_timestamp: Date;
  last_active_timestamp: Date;
  status: string;
}

const SessionsSchema = new Schema<ISession>({
  admin_id: { type: Schema.Types.ObjectId, ref: 'Account', index: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'Users', index: true },
  socket_io_id: { type: String, default: null },
  ip_address: { type: String, required: true },
  user_agent: { type: String, required: true },
  device: { type: String, required: true },
  login_timestamp: { type: Date, required: true },
  last_active_timestamp: { type: Date, required: true },
  status: { type: String, required: true },
});

const SessionsModel = model<ISession>('Sessions', SessionsSchema);

export default SessionsModel;
