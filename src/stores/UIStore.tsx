/* eslint-disable max-classes-per-file */
/* eslint-disable no-unused-expressions */
import { makeAutoObservable } from 'mobx';
import { BottomSheetOptions, ModalOptions, ConfirmOptions } from 'types/interfaces';

class UIStore {
  reload = false;

  options: any = undefined;

  bottomSheet: BottomSheet = new BottomSheet();

  modal: Modal = new Modal();

  header: Header = new Header();

  confirm: Confirm = new Confirm();

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * @description 주로 FlatList의 초기화를 위해 사용됨.
   * @param value
   */
  setReload(value: boolean, from?: number) {
    this.reload = value;
  }

  setPortalComponent(options: any) {
    this.options = options;
  }
}

class Header {
  headerShow = false;

  component: any;

  constructor() {
    makeAutoObservable(this);
  }
}

class Modal {
  modalShow = false;

  options: ModalOptions | undefined;

  constructor() {
    makeAutoObservable(this);
  }

  show(options: ModalOptions) {
    this.options = options;
    this.modalShow = true;
  }

  apply(object?: any) {
    this.options?.onApply && this.options.onApply(object);
    this.modalShow = false;
    setTimeout(() => {
      this.options = undefined;
    }, 500);
  }

  close() {
    this.options?.onDismiss && this.options.onDismiss();
    // Modal 닫힐때, 사라졌던 버튼이 보이는 현상때문에 주석처리
    this.modalShow = false;
    setTimeout(() => {
      this.options = undefined;
    }, 500);
  }
}

class Confirm {
  /**
   * @Confirm
   */
  confirmShow = false;

  options: ConfirmOptions | undefined;

  constructor() {
    makeAutoObservable(this);
  }

  show(options: ConfirmOptions) {
    this.options = options;
    this.confirmShow = true;
  }

  close() {
    if (typeof this.options?.onCancel !== 'undefined') {
      this.options?.onCancel();
    }
    this.confirmShow = false;
    // 모달이 사라지기전에 데이터가 사라져 전환이 어색해지므로 setTimeout으로 호출
    setTimeout(() => {
      this.options = undefined;
    }, 500);
  }

  confirm() {
    this.confirmShow = false;
    // 모달이 사라지기전에 데이터가 사라져 전환이 어색해지므로 setTimeout으로 호출
    setTimeout(() => {
      if (typeof this.options?.onConfirmed !== 'undefined') {
        this.options?.onConfirmed();
      }
      this.options = undefined;
    }, 500);
  }
}

class BottomSheet {
  bottomSheetShow = false;

  options: BottomSheetOptions | undefined;

  constructor() {
    makeAutoObservable(this);
  }

  show(options: BottomSheetOptions) {
    this.options = options;
    this.bottomSheetShow = true;
  }

  apply(object?: any) {
    this.options?.onApply && this.options.onApply(object);
    this.bottomSheetShow = false;
    setTimeout(() => {
      this.options = undefined;
    }, 500);
  }

  close() {
    // this.options?.onDismiss && this.options.onDismiss();
    this.bottomSheetShow = false;
    setTimeout(() => {
      // BottomSheet 닫힐때, 사라졌던 버튼이 보이는 현상때문에 주석처리(다시 살림:TGKIM)
      this.options = undefined;
    }, 500);
  }
}

export default UIStore;
