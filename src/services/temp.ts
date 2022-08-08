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
      stack: tempObj.stack,
      team: tempObj.team,
      content: tempObj.content,
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
      stack: tempObj.stack,
      team: tempObj.team,
      content: tempObj.content,
    },
  };
}

export async function update(teamId: ObjectID | string, change: Partial<ProjectTemp>):
  Promise<ServiceResult<ProjectTempModelType>> {
  const tempObj = await TempModel.findOne({
    team: teamId,
  });

  if (!tempObj) {
    throw Error('Temp Not Found');
  }

  Object.assign(tempObj, change);
  const newTempObj = await tempObj.save();
  return {
    data: {
      id: tempObj._id,
      stack: tempObj.stack,
      team: tempObj.team,
      content: tempObj.content,
    },
  };
}

export async function deleteObj(teamId: ObjectID | string):
  Promise<ServiceResult<ProjectTempModelType>> {
  const tempObj = await TempModel.findOne({
    team: teamId,
  });
  if (!tempObj) {
    throw Error('Temp Not Found');
  }
  await tempObj.remove();
  return {
    data: {
      id: tempObj._id,
      stack: tempObj.stack,
      team: tempObj.team,
      content: tempObj.content,
    },
  };
}
