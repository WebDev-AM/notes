import { FileAudioIcon, FileIcon, PlayIcon } from "lucide-react";
import AudioAttachmentItem from "@/components/MemoMetadata/Attachment/AudioAttachmentItem";
import VideoPoster from "@/components/VideoPoster";
import type { AttachmentLibraryListItem } from "@/hooks/useAttachmentLibrary";
import { cn } from "@/lib/utils";
import type { User } from "@/types/proto/api/user_service_pb";
import { getAttachmentThumbnailUrl, getAttachmentType, isMotionAttachment } from "@/utils/attachment";
import { AttachmentCreator, AttachmentMetadataLine, AttachmentOpenButton, AttachmentSourceChip } from "./AttachmentLibraryPrimitives";

type AttachmentCreators = Map<string, User | undefined>;

const AttachmentThumb = ({ item, className }: { item: AttachmentLibraryListItem; className?: string }) => {
  const type = getAttachmentType(item.attachment);
  const isMotion = isMotionAttachment(item.attachment);

  if (type === "image/*" || isMotion) {
    return (
      <div className={cn("overflow-hidden", className)}>
        <img
          src={getAttachmentThumbnailUrl(item.attachment)}
          alt={item.attachment.filename}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  if (type === "video/*") {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <VideoPoster sourceUrl={item.sourceUrl} alt={item.attachment.filename} className="h-full w-full object-cover" />
        <span className="absolute bottom-2 right-2 inline-flex h-7 w-7 items-center justify-center text-foreground">
          <PlayIcon className="h-3.5 w-3.5 fill-current" />
        </span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center text-muted-foreground", className)}>
      {type === "audio/*" ? <FileAudioIcon className="h-5 w-5" /> : <FileIcon className="h-5 w-5" />}
    </div>
  );
};

export const AttachmentDocumentRows = ({ items, creators }: { items: AttachmentLibraryListItem[]; creators?: AttachmentCreators }) => {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article key={item.attachment.name} className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center text-muted-foreground">
            <FileIcon className="h-4.5 w-4.5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-foreground" title={item.attachment.filename}>
              {item.attachment.filename}
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
              <AttachmentMetadataLine className="min-w-0 max-w-full" items={[item.fileTypeLabel, item.fileSizeLabel, item.createdLabel]} />
              <AttachmentCreator creatorName={item.attachment.creator} user={creators?.get(item.attachment.creator)} />
              <AttachmentSourceChip memoName={item.memoName} />
            </div>
          </div>

          <AttachmentOpenButton href={item.sourceUrl} />
        </article>
      ))}
    </div>
  );
};

export const AttachmentAudioRows = ({ items, creators }: { items: AttachmentLibraryListItem[]; creators?: AttachmentCreators }) => {
  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <article key={item.attachment.name} className="flex flex-col gap-2.5">
          <AudioAttachmentItem
            filename={item.attachment.filename}
            sourceUrl={item.sourceUrl}
            mimeType={item.attachment.type}
            size={Number(item.attachment.size)}
          />
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex flex-wrap items-center gap-1.5">
              <AttachmentMetadataLine className="min-w-0 max-w-full" items={[item.createdLabel]} />
              <AttachmentCreator creatorName={item.attachment.creator} user={creators?.get(item.attachment.creator)} />
              <AttachmentSourceChip memoName={item.memoName} />
            </div>
            <AttachmentOpenButton href={item.sourceUrl} />
          </div>
        </article>
      ))}
    </div>
  );
};

export const AttachmentUnusedRows = ({ items, creators }: { items: AttachmentLibraryListItem[]; creators?: AttachmentCreators }) => {
  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <article key={item.attachment.name} className="flex items-center gap-2.5">
          <AttachmentThumb item={item} className="h-10 w-10 shrink-0" />

          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-foreground" title={item.attachment.filename}>
              {item.attachment.filename}
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
              <AttachmentMetadataLine className="min-w-0 max-w-full" items={[item.fileTypeLabel, item.fileSizeLabel, item.createdLabel]} />
              <AttachmentCreator creatorName={item.attachment.creator} user={creators?.get(item.attachment.creator)} />
              <AttachmentSourceChip unlinkedLabelKey="attachment-library.labels.not-linked" />
            </div>
          </div>

          <AttachmentOpenButton className="text-warning/90 hover:text-warning" href={item.sourceUrl} />
        </article>
      ))}
    </div>
  );
};
