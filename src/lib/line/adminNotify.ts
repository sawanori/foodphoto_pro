export const runtime = 'nodejs';

async function push(payload: any) {
  const r = await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN!}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  
  if (!r.ok) {
    const msg = await r.text().catch(() => '');
    console.error('LINE push failed', r.status, msg);
  }
}

export async function notifyAdminViaLine({ title, preview, url }: {
  title: string; 
  preview: string; 
  url: string;
}) {
  console.log('[LINE] notifyAdminViaLine called with:', { title, preview, url });
  
  if (process.env.ADMIN_NOTIFY_ENABLED === 'false') {
    console.log('[LINE] Notification disabled by ADMIN_NOTIFY_ENABLED');
    return;
  }

  const groupId = process.env.LINE_ADMIN_GROUP_ID;
  const userIds = (process.env.LINE_ADMIN_USER_IDS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  
  console.log('[LINE] Group ID:', groupId || 'NOT SET');
  console.log('[LINE] User IDs:', userIds.length > 0 ? userIds : 'NOT SET');
  console.log('[LINE] Access Token exists:', !!process.env.LINE_CHANNEL_ACCESS_TOKEN);

  const message = {
    type: 'template' as const,
    altText: title,
    template: {
      type: 'buttons' as const,
      title,
      text: preview.slice(0, 60),
      actions: [{ 
        type: 'uri' as const, 
        label: '管理画面を開く', 
        uri: url 
      }]
    }
  };

  if (!groupId && userIds.length === 0) {
    console.warn('[LINE] No LINE admin target configured (LINE_ADMIN_GROUP_ID / LINE_ADMIN_USER_IDS).');
    return;
  }
  
  if (groupId) {
    console.log('[LINE] Sending to group:', groupId);
    await push({ to: groupId, messages: [message] });
    console.log('[LINE] Group notification sent');
  }
  
  if (userIds.length) {
    console.log('[LINE] Sending to users:', userIds);
    await Promise.all(userIds.map(to => push({ to, messages: [message] })));
    console.log('[LINE] User notifications sent');
  }
  
  console.log('[LINE] notifyAdminViaLine completed');
}