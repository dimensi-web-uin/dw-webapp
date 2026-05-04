import type { Database } from '@/@types/supabase.type';
import { Avatar, AvatarFallback, AvatarImage } from '../atoms/avatar';
import { getInitial } from '@/utils/string';
import { MoreVerticalIcon, Trash2Icon, UploadIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../atoms/dropdown-menu';
import { useRef, useState } from 'react';
import { LoadingOverlay } from '../atoms/loading';
import { toast } from 'sonner';
import {
  FileType,
  isUnderFileSize,
  isValidFileType,
  notUnderFileSizeMessage,
  notValidFileTypeMessage,
} from '@/utils/yup';
import { supabase } from '@/lib/supabase';
import { MB } from '@/utils/number';
import { Button } from '../atoms/button';

const AVATAR_FILETYPES: FileType[] = ['image/jpeg', 'image/jpg', 'image/png'];

const MemberAvatar = ({
  item,
  onChange,
}: {
  item: Pick<
    Database['public']['Tables']['members']['Row'],
    'id' | 'avatar_url' | 'name'
  >;
  onChange?: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);

  const _upload = async (file: File) => {
    if (!isValidFileType(file, AVATAR_FILETYPES)) {
      toast.warning(notValidFileTypeMessage(AVATAR_FILETYPES));
      return;
    }

    if (!isUnderFileSize(file, 2 * MB)) {
      toast.warning(notUnderFileSizeMessage(2 * MB));
      return;
    }

    setLoading(true);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'webp';
      const timestamp = Math.floor(Date.now() / 1000);
      const path = `${item.id}_${timestamp}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('member-avatars')
        .upload(path, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('member-avatars')
        .getPublicUrl(path);

      const { error: rpcError } = await supabase.rpc('update_member_avatar', {
        p_avatar_url: data.publicUrl,
      });

      if (rpcError) throw rpcError;
      toast.success('Avatar diperbarui');
      onChange?.();
    } catch {
      toast.error('Gagal memperbarui avatar');
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const _remove = async () => {
    if (!item.avatar_url) return;

    setLoading(true);
    try {
      const { error: rpcError } = await supabase.rpc('update_member_avatar');
      if (rpcError) throw rpcError;

      const path = item.avatar_url.split('/').pop()?.split('?')[0];
      if (path) await supabase.storage.from('member-avatars').remove([path]);

      toast.success('Avatar dihapus');
      onChange?.();
    } catch {
      toast.error('Gagal menghapus avatar');
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="relative size-24">
      {loading && <LoadingOverlay text="" />}
      <Avatar className="size-full *:rounded-lg">
        <AvatarImage src={item.avatar_url ?? ''} />
        <AvatarFallback>{getInitial(item.name)}</AvatarFallback>
      </Avatar>
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept={AVATAR_FILETYPES.join(',')}
        onChange={(e) => {
          if (e.target.files?.length) _upload(e.target.files[0]);
        }}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={'icon-xs'} className="absolute -right-1 -bottom-1">
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-40">
          <DropdownMenuItem
            disabled={!!item.avatar_url}
            onClick={() => inputRef.current?.click()}
          >
            <UploadIcon /> Unggah gambar
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            disabled={!item.avatar_url}
            onClick={_remove}
          >
            <Trash2Icon /> Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export { MemberAvatar };
