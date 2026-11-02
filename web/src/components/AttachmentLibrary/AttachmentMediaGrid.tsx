import { PlayIcon } from "lucide-react";
import MotionPhotoPreview from "@/components/MotionPhotoPreview";
import VideoPoster from "@/components/VideoPoster";
import type { AttachmentLibraryMediaItem, AttachmentLibraryMonthGroup } from "@/hooks/useAttachmentLibrary";
import { cn } from "@/lib/utils";
import type { User } from "@/types/proto/api/user_service_pb";
import { useTranslate } from "@/utils/i18n";
import { formatMediaDuration } from "@/utils/media-metadata";
import { AttachmentCreator, AttachmentMetadataLine, AttachmentOpenButton, AttachmentSourceChip } from "./AttachmentLibraryPrimitives";

interface AttachmentMediaGridProps {
  groups: AttachmentLibraryMonthGroup[];
  creators?: Map<string, User | undefined>;
  onPreview: (itemId: string) => void;
}

const AttachmentMediaCard = ({ item, creator, onPreview }: { item: AttachmentLibraryMediaItem; creator?: User; onPreview: () => void }) => {
  const t = useTranslate();
  const videoDuration = item.attachments.map((attachment) => attachment.mediaMetadata?.details).find((details) => details?.case === "video")
    ?.value.durationSeconds;

  return (
    <article className="w-screen">
      <div className="relative block h-screen w-screen cursor-pointer text-left" onClick={onPreview}>
        <div className="relative h-screen w-screen overflow-visible">
          {item.kind === "video" ? (
            <>
              <VideoPoster
                sourceUrl={item.sourceUrl}
                posterUrl={item.posterUrl}
                alt={item.filename}
                className="h-screen w-screen max-w-none object-fill"
              />
              <span
                className={cn(
                  "absolute bottom-2.5 right-2.5 inline-flex items-center text-foreground",
                  videoDuration === undefined ? "w-8" : "gap-1.5 px-2.5 text-[11px] font-medium tabular-nums",
                )}
              >
                <PlayIcon className="h-3.5 w-3.5 fill-current" />
                {videoDuration !== undefined && <span>{formatMediaDuration(videoDuration)}</span>}
              </span>
            </>
          ) : item.kind === "motion" ? (
            <MotionPhotoPreview
              posterUrl={item.posterUrl}
              motionUrl={item.previewItem.kind === "motion" ? item.previewItem.motionUrl : item.sourceUrl}
              alt={item.filename}
              presentationTimestampUs={item.previewItem.kind === "motion" ? item.previewItem.presentationTimestampUs : undefined}
              containerClassName="h-screen w-screen overflow-visible"
              mediaClassName="h-screen w-screen max-w-none object-fill"
              badgeClassName="left-3 top-3"
            />
          ) : (
            <img
              src={item.posterUrl}
              alt={item.filename}
              className="h-screen w-screen max-w-none object-fill"
              loading="lazy"
              decoding="async"
            />
          )}
        </div>
      </div>

      <div>
        <div className="flex items-start justify-between gap-2">
          <div title={item.filename}>
            {item.filename}
          </div>

          {item.kind === "motion" && (
            <span>{t("attachment-library.labels.live")}</span>
          )}
        </div>

        <AttachmentMetadataLine items={[item.fileTypeLabel, item.createdLabel !== "—" ? item.createdLabel : undefined]} />
        <AttachmentCreator creatorName={item.primaryAttachment.creator} user={creator} />
        <div className="flex items-center justify-between gap-2">
          <AttachmentSourceChip memoName={item.memoName} />
          <AttachmentOpenButton href={item.sourceUrl} />
        </div>
      </div>
    </article>
  );
};

const AttachmentMediaGrid = ({ groups, creators, onPreview }: AttachmentMediaGridProps) => {
  return (
    <div>
      {groups.map((group) => (
        <section key={group.key}>
          <div>{group.label}</div>
          <div className="flex flex-col overflow-visible">
            {group.items.map((item) => (
              <AttachmentMediaCard
                key={item.id}
                item={item}
                creator={creators?.get(item.primaryAttachment.creator)}
                onPreview={() => onPreview(item.previewItem.id)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default AttachmentMediaGrid;
