import { Injectable } from '@nestjs/common';
import { Args, Resolver, Mutation, Query, Context } from '@nestjs/graphql';

import { MapsService } from './maps.service';

import { getBearer } from '../../common/utility';
import {
  GetAllMapsListInput,
  GetAllMapsListOutput,
  GetOrigMapContentInput,
  GetOrigMapContentOutput,
  GetOrigMapListInput,
  GetOrigMapPhrasesInput,
  GetOrigMapPhrasesOutput,
  GetOrigMapsListOutput,
  GetOrigMapWordsInput,
  GetOrigMapWordsOutput,
  GetTranslatedMapContentInput,
  GetTranslatedMapContentOutput,
  MapUploadOutput,
} from './types';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { AuthenticationService } from '../authentication/authentication.service';
import { ErrorType } from 'src/common/types';
import { FileService } from '../file/file.service';
import { IFile } from '../file/types';

@Injectable()
@Resolver(Map)
export class MapsResolver {
  constructor(
    private mapService: MapsService,
    private authenticationService: AuthenticationService,
    private fileService: FileService,
  ) {}

  @Mutation(() => MapUploadOutput)
  async mapUpload(
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename: map_file_name }: FileUpload,
    @Args({ name: 'thumbnailFile', type: () => GraphQLUpload, nullable: true })
    mapThumbUpload: FileUpload | undefined | null,
    @Context() req: any,
  ): Promise<MapUploadOutput> {
    const bearer = getBearer(req);
    let fileBody: string;
    let thumbFileBody: string;
    // need to get all uploads to prevent the request to hang up in pending state
    for await (const chunk of createReadStream()) {
      if (!fileBody) {
        fileBody = chunk;
      } else {
        fileBody += chunk;
      }
    }
    if (mapThumbUpload) {
      for await (const chunk of mapThumbUpload.createReadStream()) {
        if (!thumbFileBody) {
          thumbFileBody = chunk;
        } else {
          thumbFileBody += chunk;
        }
      }
    }

    const user_id = await this.authenticationService.get_user_id_from_bearer(
      bearer,
    );

    const admin_id = await this.authenticationService.get_admin_id();

    if (admin_id !== user_id) {
      return {
        error: ErrorType.Unauthorized,
        mapFileOutput: null,
      };
    }

    const userToken = await this.authenticationService.getAdminToken();
    try {
      const map = await this.mapService.parseAndSaveNewMap({
        fileBody,
        mapFileName: map_file_name,
        token: userToken,
      });
      let previewFile: IFile;
      if (mapThumbUpload.createReadStream) {
        // previewFile = await this.fileService.uploadFile(
        //   mapThumbUpload.createReadStream(),
        //   mapThumbUpload.filename,
        //   mapThumbUpload.mimetype,
        //   20, //todo get real size
        // );
        console.log('asdfasdfas');
      }

      await this.mapService.setPreviewFileId(
        map.original_map_id,
        previewFile.id,
      );

      return {
        error: ErrorType.NoError,
        mapFileOutput: map,
      };
    } catch (error) {
      return {
        error: error,
        mapFileOutput: null,
      };
    }
  }

  @Query(() => GetOrigMapsListOutput)
  async getOrigMapsList(
    @Args('input') input: GetOrigMapListInput,
  ): Promise<GetOrigMapsListOutput> {
    const maps = await this.mapService.getOrigMaps();
    return maps;
  }

  @Query(() => GetAllMapsListOutput)
  async getAllMapsList(
    @Args('input') input: GetAllMapsListInput,
  ): Promise<GetAllMapsListOutput> {
    const maps = await this.mapService.getAllMapsList(input.lang);
    return maps;
  }

  @Query(() => GetOrigMapContentOutput)
  async getOrigMapContent(
    @Args('input') input: GetOrigMapContentInput,
  ): Promise<GetOrigMapContentOutput> {
    const mapContent = await this.mapService.getOrigMapContent(
      input.original_map_id,
    );
    return mapContent;
  }

  @Query(() => GetTranslatedMapContentOutput)
  async getTranslatedMapContent(
    @Args('input') input: GetTranslatedMapContentInput,
  ): Promise<GetTranslatedMapContentOutput> {
    const mapContent = await this.mapService.getTranslatedMapContent(
      input.translated_map_id,
    );
    return mapContent;
  }

  @Query(() => GetOrigMapWordsOutput)
  async getOrigMapWords(
    @Args('input', { nullable: true }) input?: GetOrigMapWordsInput,
  ): Promise<GetOrigMapWordsOutput> {
    const words = await this.mapService.getOrigMapWords(input);

    return words;
  }

  @Query(() => GetOrigMapPhrasesOutput)
  async getOrigMapPhrases(
    @Args('input', { nullable: true }) input?: GetOrigMapPhrasesInput,
  ): Promise<GetOrigMapPhrasesOutput> {
    const origMapPhraseTranslations = await this.mapService.getOrigMapPhrases(
      input,
    );
    return origMapPhraseTranslations;
  }
}
