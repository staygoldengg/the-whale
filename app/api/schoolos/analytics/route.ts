import { fail, ok } from '@/lib/api';
import { requireAuth } from '@/lib/auth';
import { getAnalyticsSummary } from '@/lib/schoolOS';

export async function GET() {
  try {
    await requireAuth(['admin']);
    return ok(await getAnalyticsSummary());
  } catch (error) {
    return fail(error);
  }
}
