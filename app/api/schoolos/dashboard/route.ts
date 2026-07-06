import { fail, ok } from '@/lib/api';
import { requireAuth } from '@/lib/auth';
import { getAdminCommandCenter, getTeacherWorkspace } from '@/lib/schoolOS';

export async function GET(req: Request) {
  try {
    const auth = await requireAuth();
    const url = new URL(req.url);
    const mode = url.searchParams.get('mode') ?? (auth.profile.role === 'admin' ? 'admin' : 'teacher');
    if (mode === 'admin') {
      await requireAuth(['admin']);
      return ok(await getAdminCommandCenter());
    }
    const classroom = url.searchParams.get('classroom');
    return ok(await getTeacherWorkspace({ userEmail: auth.profile.email, classroom }));
  } catch (error) {
    return fail(error);
  }
}
