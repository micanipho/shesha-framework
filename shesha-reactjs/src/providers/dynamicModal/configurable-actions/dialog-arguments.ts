import { ButtonGroupItemProps } from '@/providers/buttonGroupConfigurator/models';
import { FormIdentifier, FormMarkup } from '../../form/models';
import { ModalFooterButtons } from '../models';
import closeDialogArgumentsJson from './close-dialog-arguments.json';
import { IHasVersion } from '@/utils/fluentMigrator/migrator';
import { IKeyValue } from '@/interfaces/keyValue';

export interface ICloseModalActionArguments {
  showDialogResult?: string;
}

export interface IShowModalActionArguments extends IHasVersion {
  modalTitle: string;
  formId: FormIdentifier | undefined;
  formMode?: 'edit' | 'readonly';
  formArguments?: string | undefined;
  /**
   * Properties merged into the payload when the modal form is submitted, e.g. `parentId` for a modal
   * used inside a childTable. Unlike `formArguments` (which only feed the form's data loader), these
   * reach the request body.
   *
   * Note: properties the modal form owns itself always win - these only fill in properties the form
   * does not manage, so they can never silently overwrite what the user typed.
   */
  additionalSubmitProperties?: IKeyValue[] | undefined;
  modalWidth?: number | string | undefined;
  customWidth?: number | undefined;
  widthUnits?: '%' | 'px' | undefined;
  buttons?: ButtonGroupItemProps[] | undefined;
  footerButtons?: ModalFooterButtons | undefined;
  showModalFooter?: boolean | undefined;
  showCloseIcon?: boolean | undefined;
  /**
   * What http verb to use when submitting the form. Used in conjunction with `showModalFooter`
   */
  submitHttpVerb?: 'POST' | 'PUT';
}

export const closeDialogArgumentsForm = closeDialogArgumentsJson as FormMarkup;
