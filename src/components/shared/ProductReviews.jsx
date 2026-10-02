import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { StarRating } from "./StarRating";
import { Pagination } from "./Pagination";
import { useAuth } from "@/hooks/useAuth";
import { useMeQuery } from "@/store/api/authApi";
import { useGetAllReviewsByProductQuery, useCreateReviewMutation, useUpdateReviewMutation, useDeleteReviewMutation } from "@/store/api/reviewApi";
import { getApiErrorMessage } from "@/lib/auth";
import { getImageUrl } from "@/lib/utils";

export function ProductReviews({ productId }) {
  const { isAuthenticated } = useAuth();
  const { data: me } = useMeQuery(undefined, { skip: !isAuthenticated });
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetAllReviewsByProductQuery({ productId, page, limit: 10 });
  const [editing, setEditing] = useState(null);
  const [create, createState] = useCreateReviewMutation();
  const [update, updateState] = useUpdateReviewMutation();
  const [remove, removeState] = useDeleteReviewMutation();
  const busy = createState.isLoading || updateState.isLoading || removeState.isLoading;
  async function save(body) {
    try {
      if (editing) await update({ id: editing._id, ...body }).unwrap();
      else await create({ product: productId, ...body }).unwrap();
      setEditing(null); toast.success('Sharh saqlandi'); return true;
    } catch (error) { toast.error(getApiErrorMessage(error, 'Sharhni saqlab bo‘lmadi')); return false; }
  }
  return <div className="space-y-4">
    {isLoading ? <p>Sharhlar yuklanmoqda...</p> : isError ? <p role="alert">Sharhlarni yuklab bo‘lmadi</p> : (data?.data || []).length === 0 ? <p>Hozircha sharhlar yo‘q</p> : data.data.map(review => <div key={review._id} className="flex gap-3 border-b pb-4">
      <Avatar src={getImageUrl(review.user?.profile_image)} fallback={(review.user?.name || 'U')[0]} /><div className="flex-1">
        <p className="font-medium">{review.user?.name}</p><StarRating rating={review.rating} showValue={false} size={12} /><p className="mt-1 text-sm">{review.comment}</p>
        {me?.data?._id && me.data._id === review.user?._id && <div className="mt-2 flex gap-2"><Button size="sm" variant="outline" disabled={busy} onClick={() => setEditing(review)}>Tahrirlash</Button><Button size="sm" variant="destructive" disabled={busy} onClick={async () => {
          if (!window.confirm('Sharhni o‘chirishni xohlaysizmi?')) return;
          try { await remove(review._id).unwrap(); if (editing?._id === review._id) setEditing(null); toast.success('Sharh o‘chirildi'); }
          catch (error) { toast.error(getApiErrorMessage(error, 'Sharhni o‘chirib bo‘lmadi')); }
        }}>O‘chirish</Button></div>}
      </div>
    </div>)}
    <Pagination pagination={data?.pagination} onPageChange={setPage} disabled={busy} />
    {isAuthenticated && <><p className="text-sm text-muted-foreground">Sharh qoldirish uchun mahsulotni xarid qilgan va qabul qilgan bo‘lishingiz kerak.</p>
      <ReviewForm key={editing?._id || 'new'} review={editing} onSave={save} busy={busy} onCancel={() => setEditing(null)} />
    </>}
  </div>;
}
function ReviewForm({ review, onSave, busy, onCancel }) {
  const [rating, setRating] = useState(review?.rating || 5);
  const [comment, setComment] = useState(review?.comment || '');
  return <form className="space-y-3" onSubmit={async e => { e.preventDefault(); if (busy) return; if (await onSave({ rating, comment: comment.trim() })) setComment(''); }}>
    <label className="flex items-center gap-3 text-sm">Baho<select aria-label="Baho" className="rounded-md border bg-background p-2" value={rating} onChange={e => setRating(Number(e.target.value))} disabled={busy}>{[5,4,3,2,1].map(value => <option key={value} value={value}>{value}</option>)}</select></label>
    <Textarea aria-label="Sharh" placeholder="Mahsulot haqidagi fikringiz" value={comment} onChange={e => setComment(e.target.value)} disabled={busy} />
    <div className="flex gap-2"><Button disabled={busy}>{review ? 'Sharhni saqlash' : 'Sharh qoldirish'}</Button>{review && <Button type="button" variant="outline" disabled={busy} onClick={onCancel}>Bekor qilish</Button>}</div>
  </form>;
}
