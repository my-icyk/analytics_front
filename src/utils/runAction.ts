import { message } from "antd";
// utils/runAction.ts
export async function runAction(
  action: () => Promise<unknown>,
  msgs: { success: string; error: string },
  options: { rethrow?: boolean } = {},
): Promise<boolean> {
  try {
    await action();
    message.success(msgs.success);
    return true;
  } catch (error) {
    console.error(msgs.error, error);
    message.error(msgs.error);
    if (options.rethrow) throw error; // lets a modal stay open
    return false;
  }
}
