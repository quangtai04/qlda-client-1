/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useRouteMatch } from 'react-router';
import { toast } from 'react-toastify';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  UncontrolledDropdown,
} from 'reactstrap';
import { commentService } from '../../../services/comments/api';
import { postService } from '../../../services/posts/api';
import socket from '../../../socketioClient';
import ModalTrueFalse from '../../ModalTrueFalse';
import ModalEditPost from './ModalEditPost';

const deletePost = async (postId) => {
  postService.deletePost({ postId: postId }).then((res) => {
    toast.success('Xóa bài thành công!');
    socket.emit('createdPost', {
      postList: res.data.data.post,
      roomId: res.data.data.projectId,
    });
  });
};
const editPost = async (postId, content) => {
  postService
    .updatePost({ postId: postId, content: content })
    .then((res) => {
      toast.success('Sửa bài thành công!');
      socket.emit('createdPost', {
        postList: res.data.data.post,
        roomId: res.data.data.projectId,
      });
    })
    .catch((err) => {
      toast.error('Lỗi! Không thể sửa bài');
    });
};
function PostHeader({
  userId,
  author,
  date,
  postId,
  setShowDelete,
  setShowEdit,
  setDataUser,
  setDataDelete,
  setDataEdit,
}) {
  return (
    <>
      <div className="d-flex bd-highlight mb-3">
        <div className="p-2 bd-highlight">
          <div className="post-header">
            <img className="avatar" src={author.avatar} alt="" />
            <div className="details">
              <span>{author.username}</span>
              <span>{date}</span>
            </div>
          </div>
        </div>
        <div className="ml-auto bd-highlight">
          <UncontrolledDropdown
            disabled={userId === author.authorId ? false : true}>
            <DropdownToggle
              className="btn-icon-only text-light"
              href="#pablo"
              role="button"
              size="sm"
              color=""
              onClick={(e) => e.preventDefault()}
              disabled={userId === author.authorId ? false : true}>
              <i
                className={
                  userId === author.authorId
                    ? 'fas fa-ellipsis-v text-info'
                    : 'fas fa-ellipsis-v '
                }
              />
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow" right>
              <DropdownItem
                href="#pablo"
                onClick={(e) => {
                  // e.preventDefault()
                  setShowEdit(true);
                  setDataUser(author);
                }}>
                <span style={{ fontWeight: 'bold' }} className="text-primary">
                  Edit post
                </span>
              </DropdownItem>
              <DropdownItem
                href="#pablo"
                onClick={(e) => {
                  setDataDelete(postId);
                  setShowDelete(true);
                }}>
                <span style={{ fontWeight: 'bold' }} className="text-danger">
                  Delete post
                </span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </div>
    </>
  );
}

function PostComments({ comments }) {
  return (
    <div className="post-comments">
      {comments.map((comment, index) => (
        <div key={index} className="comment">
          <img className="avatar" src={comment.author.avatar} alt="" />
          <p>
            <span>{comment.author.name}</span>
            {comment.content}
          </p>
        </div>
      ))}
    </div>
  );
}

function PostItem({ authorId, date, content, comments, _id, userId }) {
  const { params } = useRouteMatch();
  const { projectId } = params as any;
  const [showDelete, setShowDetele] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [dataDelete, setDataDelte] = useState();
  const [dataEdit, setDataEdit] = useState();
  const [dataUser, setDataUser] = useState({});

  const AddComment = async (postId, comment) => {
    commentService
      .addComment({ postId: postId, content: comment })
      .then((res) => {
        socket.emit('createdPost', {
          postList: res.data.data.post,
          roomId: projectId,
        });
      })
      .catch((err) => {
        toast.error('Lỗi không thể Add comment');
      });
  };
  return (
    <>
      <ModalTrueFalse
        show={showDelete}
        data={{
          title: 'delete the post ',
          button_1: {
            title: 'Cancel',
          },
          button_2: {
            title: 'Delete',
          },
        }}
        setClose={() => {
          setShowDetele(false);
        }}
        funcButton_1={() => {}}
        funcButton_2={() => {
          deletePost(dataDelete);
        }}
        funcOnHide={() => {}}></ModalTrueFalse>

      <ModalEditPost
        data={{ content: content, postId: _id, author: { ...dataUser } }}
        show={showEdit}
        funcQuit={() => {
          setShowEdit(false);
        }}
        funcEdit={(postId, content) => {
          editPost(postId, content);
        }}></ModalEditPost>

      <div className="post">
        <PostHeader
          userId={userId}
          author={authorId}
          date={date}
          postId={_id}
          setShowDelete={setShowDetele}
          setShowEdit={setShowEdit}
          setDataUser={setDataUser}
          setDataDelete={setDataDelte}
          setDataEdit={setDataEdit}
        />
        <div className="post-content row justify-content-center">
          <div className="col-11">
            <p style={{ fontSize: '20px' }}>{content}</p>
          </div>
        </div>
        <div className="post-content-action">
          {/* <div
          className="list-btn-action"
          style={{
            top: '0px',
            left: '0px',
            opacity: 0,
            backgroundColor: '#f0f2f5',
            borderRadius: '10px',
          }}>
          <span data-name="Thích" className="mr-2">
            <img
              src="https://res.cloudinary.com/vnu-uet/image/upload/v1606254615/react%20fb%20icon/like_yak6sm.png"
              alt="like"
            />
          </span>
          <span data-name="Yêu thích" className="mr-2">
            <img
              src="https://res.cloudinary.com/vnu-uet/image/upload/v1606254614/react%20fb%20icon/love_f7xt7j.png"
              alt="heart"
            />
          </span>
          <span data-name="Thương Thương" className="mr-2">
            <img
              src="https://res.cloudinary.com/vnu-uet/image/upload/v1606254609/react%20fb%20icon/care_1_y1dxgw.png"
              alt="love"
            />
          </span>
          <span data-name="Haha" className="mr-2">
            <img
              src="https://res.cloudinary.com/vnu-uet/image/upload/v1606254650/react%20fb%20icon/haha_zjqk0h.png"
              alt="haha"
            />
          </span>
          <span data-name="Wow" className="mr-2">
            <img
              src="https://res.cloudinary.com/vnu-uet/image/upload/v1606254611/react%20fb%20icon/wow_socetu.png"
              alt="wow"
            />
          </span>
          <span data-name="Buồn" className="mr-2">
            <img
              src="https://res.cloudinary.com/vnu-uet/image/upload/v1606254614/react%20fb%20icon/sad_qvnhgr.png"
              alt="cry"
            />
          </span>
          <span data-name="Phẩn nộ" className="mr-2">
            <img src="../images/icon/angry.png" alt="angry" />
          </span>
          <span data-name="Mãi yêu" className="mr-2">
            <img src="../images/icon/flower.png" alt="flower" />
          </span>
        </div> */}

          <div className="action">
            <div className="action-detail-action">
              <div className="action-detail-action-like">
                <img
                  className="mr-1"
                  src="https://res.cloudinary.com/vnu-uet/image/upload/v1606254611/react%20fb%20icon/wow_socetu.png"
                  alt="action"
                />
                <img
                  className="mr-3"
                  src="https://res.cloudinary.com/vnu-uet/image/upload/v1606254609/react%20fb%20icon/care_1_y1dxgw.png"
                  alt="action"
                />
                <span>Bạn và 3 người khác</span>
              </div>
              <div className="action-detail-action-comment">
                <span>{comments.length} bình luận </span>
              </div>
            </div>
            <div className="action-btn">
              <div className="action-btn-like">
                <img
                  src="https://res.cloudinary.com/vnu-uet/image/upload/v1606254611/react%20fb%20icon/wow_socetu.png"
                  alt="action like"
                />
                <span className="color-gr-yellow ml-3">Haha</span>
              </div>
              <div className="action-btn-comment">
                <img
                  src="https://res.cloudinary.com/vnu-uet/image/upload/v1606254779/react%20fb%20icon/btn-comment_kc8zvu.png"
                  alt="action comment "
                />
                <span className="ml-3">Bình luận</span>
              </div>
            </div>
          </div>
        </div>

        <PostComments comments={comments} />
        <FormGroup className="mb-3 ">
          <InputGroup className="input-group-alternative ">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <i className="fas fa-edit"></i>
              </InputGroupText>
            </InputGroupAddon>
            <Input
              id={_id}
              style={{ backgroundColor: '#f0f2f5' }}
              placeholder="Viết bình luận"
              type="email"
              autoComplete="new-email"
              className="pl-3"
              onChange={(event) => {
                event.target.onkeyup = (key) => {
                  let comment = document.getElementById(
                    _id,
                  ) as HTMLInputElement;
                  if (key.keyCode === 13) {
                    AddComment(_id, comment.value);
                    comment.value = '';
                  }
                };
              }}
            />
          </InputGroup>
        </FormGroup>
      </div>
    </>
  );
}

export default PostItem;
