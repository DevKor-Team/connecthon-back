/* eslint-disable no-param-reassign */
import { ObjectID } from 'bson';
import { ServiceResult } from '@/interfaces/common';
import TempModel from '@/models/temp';
import ProjectModel from '@/models/project';
import { ProjectTempModel as ProjectTempModelType, ProjectTemp } from '@/interfaces/project';

export async function get(teamId: ObjectID | string)
  : Promise<ServiceResult<ProjectTempModelType>> {
  const tempObj = await TempModel.findOne({ team: teamId });
  if (!tempObj) {
    throw Error('Temp Not Found');
  }
  return {
    data: {
      id: tempObj._id,
      ...tempObj,
    },
  };
}

export async function create(teamId: ObjectID | string):
  Promise<ServiceResult<ProjectTempModelType>> {
  const existingTemp = await TempModel.findOne({
    team: teamId,
  });
  if (existingTemp) {
    throw Error('Temp already exists');
  }

  const project = await ProjectModel.findOne({ team: teamId });

  const tempObj = await TempModel.create({
    team: teamId,
    content: project?.content,
    stack: project?.stack,
  });

  return {
    data: {
      id: tempObj._id,
      ...tempObj,
    },
  };
}

export async function update(id: ObjectID | string, change: Partial<ProjectTemp>):
  Promise<ServiceResult<ProjectTempModelType>> {
  const tempObj = await TempModel.findById(id);

  if (!tempObj) {
    throw Error('Temp Not Found');
  }

  if (change.team) change.team = undefined;

  Object.assign(tempObj, change);
  const newTempObj = await tempObj.save();
  return {
    data: {
      id: newTempObj._id,
      ...newTempObj,
    },
  };
}

export async function deleteObj(id: ObjectID | string):
  Promise<ServiceResult<ProjectTempModelType>> {
  const tempObj = await TempModel.findById(id);
  if (!tempObj) {
    throw Error('Temp Not Found');
  }
  await tempObj.remove();
  return {
    data: {
      id: tempObj._id,
      ...tempObj,
    },
  };
}
