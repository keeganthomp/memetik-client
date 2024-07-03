import { Comment as CommentT } from '@/graphql/__generated__/graphql';
import { formatAddress } from '@/lib/utils';
import moment from 'moment';

const Comment = ({ comment }: { comment: CommentT }) => {
  return (
    <div className="pb-3 flex flex-col gap-1">
      <div className="flex justify-between items-center text-xs text-gray-400 font-thin">
        <p className="text-gray-700">{formatAddress(comment.creator)}</p>
        <p>{moment(comment.createdAt).fromNow()}</p>
      </div>
      <p className="font-light text-sm">{comment.text}</p>
    </div>
  );
};

export default Comment;