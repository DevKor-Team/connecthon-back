/* eslint-disable no-param-reassign */
import { ObjectID } from 'bson';
import { ServiceResult } from '@/interfaces/common';
import ProjectModel from '@/models/project';
import { ProjectModel as ProjectModelType, Project } from '@/interfaces/project';

export async function get(teamId: ObjectID | string)
  : Promise<ServiceResult<ProjectModelType>> {
  const projectObj = await ProjectModel.findOne({ team: teamId });
  if (!projectObj) {
    throw Error('Project Not Found');
  }
  return {
    data: {
      id: projectObj._id,
      ...projectObj,
    },
  };
}

export async function getList()
  : Promise<ServiceResult<ProjectModelType[]>> {
  const projectObjs = await ProjectModel.find();
  const projectList = projectObjs.map((projectObj) => ({
    id: projectObj._id,
    ...projectObj,
  }));

  return {
    data: projectList,
  };
}

export async function create(teamId: ObjectID | string):
  Promise<ServiceResult<ProjectModelType>> {
  const existingProject = await ProjectModel.findOne({
    team: teamId,
  });
  if (existingProject) {
    throw Error('Project already exists');
  }

  const projectObj = await ProjectModel.create({
    team: teamId,
    content: '',
    stack: [],
    likes: [],
  });

  return {
    data: {
      id: projectObj._id,
      ...projectObj,
    },
  };
}

export async function update(id: ObjectID | string, change: Partial<Project>):
  Promise<ServiceResult<ProjectModelType>> {
  const projectObj = await ProjectModel.findById(id);

  if (!projectObj) {
    throw Error('Project Not Found');
  }

  if (change.team) change.team = undefined;
  if (change.likes) {
    change.likes.forEach((like) => {
      if (projectObj.likes.includes(like)) {
        projectObj.likes = projectObj.likes.filter((val) => (val !== like));
      } else {
        projectObj.likes.push(like);
      }
    });
    change.likes = undefined;
  }

  Object.assign(projectObj, change);
  const newProjectObj = await projectObj.save();
  return {
    data: {
      id: newProjectObj._id,
      ...newProjectObj,
    },
  };
}

export async function deleteObj(id: ObjectID | string):
  Promise<ServiceResult<ProjectModelType>> {
  const projectObj = await ProjectModel.findById(id);
  if (!projectObj) {
    throw Error('Project Not Found');
  }
  await projectObj.remove();
  return {
    data: {
      id: projectObj._id,
      ...projectObj,
    },
  };
}
