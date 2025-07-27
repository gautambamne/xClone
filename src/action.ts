"use server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import z from "zod";
import { revalidatePath } from "next/cache";
import { UploadResponse } from "imagekit/dist/libs/interfaces";
import { imagekit } from "./utils";


export const followUser = async (targetUserId: string) => {
  const { userId } = await auth();
  if (!userId) return;
  const existingFollow = await prisma.follow.findFirst({
    where: {
      followerId:userId,
      followingId:targetUserId,
    },
  });

  if (existingFollow) {
    await prisma.like.delete({
      where: { id: existingFollow.id },
    });
  } else {
    await prisma.follow.create({
      data: { followerId: userId, followingId: targetUserId },
    });
  }
};

export const likePost = async (postId: number) => {
  const { userId } = await auth();
  if (!userId) return;
  const existingLike = await prisma.like.findFirst({
    where: {
      userId,
      postId: postId,
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: { id: existingLike.id },
    });
  } else {
    await prisma.like.create({
      data: { userId, postId },
    });
  }
};

export const rePost = async (postId: number) => {
  const { userId } = await auth();
  if (!userId) return;
  const existingRePost = await prisma.post.findFirst({
    where: {
      userId: userId,
      rePostId: postId,
    },
  });

  if (existingRePost) {
    await prisma.post.delete({
      where: { id: existingRePost.id },
    });
  } else {
    await prisma.post.create({
      data: { userId, rePostId: postId },
    });
  }
};

export const savePost = async (postId: number) => {
  const { userId } = await auth();
  if (!userId) return;
  const existingSavedPost = await prisma.savedPosts.findFirst({
    where: {
      userId: userId,
      postId: postId,
    },
  });

  if (existingSavedPost) {
    await prisma.like.delete({
      where: { id: existingSavedPost.id },
    });
  } else {
    await prisma.savedPosts.create({
      data: { userId, postId },
    });
  }
};

export const addComment = async (
  state: { success: boolean; error: boolean } | undefined,
  formData: FormData
): Promise<{ success: boolean; error: boolean }> => {
  const { userId } = await auth();
  if (!userId) return { success: false, error: true };

  const postId = formData.get("postId");
  const username = formData.get("username");
  const desc = formData.get("desc");

  const Comment = z.object({
    parentPostId: z.number(),
    desc: z.string().max(140),
  });

  const validateFields = Comment.safeParse({
    parentPostId: Number(postId),
    desc: desc,
  });

  if (!validateFields.success) {
    console.log(validateFields.error.flatten().fieldErrors);
    return { success: false, error: true };
  }

  try {
    await prisma.post.create({
      data: {
        ...validateFields.data,
        userId: userId,
      },
    });
    revalidatePath(`/${username}/status/${postId}`);
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const addPost = async (
  prevState: { success: boolean; error: boolean },
  formData: FormData
) => {
  const { userId } = await auth();
  if (!userId) return { success: false, error: true };

  const desc = formData.get("desc");
  const file = formData.get("file") as File;
  const isSensitive = formData.get("isSensitive") as string;
  const imgType = formData.get("imgType");

  const uploadFile = async (file: File): Promise<UploadResponse> => {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const transformation = `w-600,${
      imgType === "square" ? "ar-1-1" : imgType === "wide" ? "ar-16-9" : ""
    }`;

    return new Promise((resolve, reject) => {
      imagekit.upload(
        {
          file: buffer,
          fileName: file.name,
          folder: "/posts",
          ...(file.type.includes("image") && {
            transformation: {
              pre: transformation,
            },
          }),
        },
        function (error, result) {
          if (error) console.log(error);
          else resolve(result as UploadResponse);
        }
      );
    });
  };
  const Post = z.object({
    desc: z.string().max(140),
    isSensitive: z.boolean().optional(),
  });

  const validateFields = Post.safeParse({
    desc: desc,
    isSensitive: JSON.parse(isSensitive),
  });

  if (!validateFields.success) {
    console.log(validateFields.error.flatten().fieldErrors);
    return { success: false, error: true };
  }

  let img = "";
  let imgHeight = 0;
  let video = "";

  if (file.size) {
    const result: UploadResponse = await uploadFile(file);

    if (result.fileType === "image") {
      img = result.filePath;
      imgHeight = result.height || 0;
    } else {
      video = result.filePath;
    }
  }

  try {
    await prisma.post.create({
      data: {
        ...validateFields.data,
        userId: userId,
        img,
        imgHeight,
        video,
      },
    });
    revalidatePath(`/`);
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};
