import React from 'react';
import './index.css';

function ElectionsProcess() {
  return (
    <div className='w-full mx-auto px-5 py-8 bg-white h-full'>
      <div className='flex flex-col items-center process'>
        <h1>Nominations</h1>
        <p className='text-neutral-500 text-xl mt-3 text-center'>
            Learn more about how you can apply today.
        </p>
      </div>
      {/* NOMINATION PROCESS */}
      <div className='my-10 md:w-[45%] w-full flex justify-center flex-col mx-auto'>
        <p className='text-2xl font-bold mb-4 text-primary'>Nominations Process</p>
        <div className='ml-4'>
          <ol className='list-decimal space-y-4'>
            <li>
              Nomination period: <b><u>17 August 2026, 0900H - 23 August 2026, 1200H</u></b>
            </li>
            <li>
              Only a Club Member<strong className='text-red-600'>*</strong> shall be eligible to be nominated for an election.
            </li>
            <li>
              As a member of the NUS Students' Computing Club, you have 2 options<strong className='text-red-600'>**</strong>:
              <ol type='a' className='list-inside ml-8 mt-2 space-y-2' style={{ listStyle: 'lower-alpha' }}>
                <li>Run as a Management Committee Member</li>
                <li>Run as a NUSSU EXCO Representative</li>
              </ol>

            </li>
            <li>
              The Election Committee shall prescribe a procedure for Club Members to follow in order to be nominated for the election. This procedure shall adhere to the following:
              <ol type='a' className='list-inside ml-8 mt-2 space-y-1' style={{ listStyle: 'lower-alpha' }}>
                <li>Any nomination of a Club Member shall be endorsed by a Proposer and a Seconder who must both be Club Members;</li>
                <li>A Club Member shall not be the Proposer or the Seconder for his own nomination;</li>
                <li>The Club Member being nominated must accept the nomination in writing before being considered a Nominee.</li>
              </ol>
            </li>
            <li>
              You are NOT eligible for this election if you are:
              <ol type='a' className='list-inside ml-8 mt-2 space-y-2' style={{ listStyle: 'lower-alpha' }}>
                <li>Guilty of a disciplinary offence</li>
                <li>Under academic warning or probation</li>
              </ol>
            </li>
          </ol>
          <p className='text-red-600 mt-4'><strong>*</strong> All full-time undergraduate students in the School of Computing are members of the NUS Students' Computing Club by default.</p>
          <p className='text-red-600 mt-1'><strong>**</strong> You may not run for both positions concurrently.</p>
        </div>
      </div>

      <div className='border-t border-gray-300 my-10 w-full md:w-[48%] mx-auto'></div>

      {/* NOMINATION FOR MANAGEMENT COMMITTEE MEMBER */}
      <div className='my-10 md:w-[45%] w-full flex justify-center flex-col mx-auto'>
        <p className='text-2xl font-bold mb-4 text-primary'>Nomination for Management Committee Member</p>
        <div className='ml-4'>
          <ol className='list-decimal space-y-4'>
            <li>
              Candidates are required to submit the following documents to <a href='mailto:elections@nuscomputing.com' className='text-[#e58e26]'><strong>elections@nuscomputing.com</strong></a> by <b><u>23 August 2026, 1200H</u></b>:
              <ol type='a' className='list-inside ml-8 mt-2 space-y-2' style={{ listStyle: 'lower-alpha' }}>
                <li><a href='/elections/29th Management Committee Nominee Application FormA.docx' target='_blank' className='text-red-600'><strong>Nominee Agreement Form (Form A)</strong></a></li>
                <li><a href='/elections/29th Management Committee Nominee Application FormB.docx' target='_blank' className='text-red-600'><strong>Nominee Agreement Form (Form B)</strong></a></li>
              </ol>
            </li>
            <li>
              Candidates must declare the primary position they are contesting for. Declaring a secondary position is optional. A Nominee may not change their primary position after the end of the nomination period, but may change it during the Internal Elections.
            </li>
          </ol>
        </div>
      </div>

      <div className='border-t border-gray-300 my-10 w-full md:w-[48%] mx-auto'></div>

      {/* NOMINATION FOR NUSSU EXCO REPRESENTATIVE */}
      <div className='my-10 md:w-[45%] w-full flex justify-center flex-col mx-auto'>
        <p className='text-2xl font-bold mb-4 text-primary'>Nomination for NUSSU EXCO Representative</p>
        <div className='ml-4'>
          <ol className='list-decimal space-y-3'>
            <li>
              Candidates are required to submit the following documents to <a href='mailto:elections@nuscomputing.com' className='text-[#e58e26]'><strong>elections@nuscomputing.com</strong></a> by <b><u>23 August 2026, 1200H</u></b>:
              <ol type='a' className='list-inside ml-8 mt-2 space-y-1' style={{ listStyle: 'lower-alpha' }}>
                <li><a href='/elections/48th NUSSU EXCO Representative Nomination Form.pdf' target='_blank' className='text-red-600'><strong>48th NUSSU EXCO Representative Nomination Form</strong></a></li>
              </ol>
            </li>
            <li>
              Candidates must get an outgoing elected member of the Constituent Club Management Committee to indicate that the candidate has consulted with the member(s) of the Constituent Club Management Committee to sign the nomination form.
            </li>
            <li>
              Consultation will be on the expected roles and duties to be undertaken as a NUSSU Executive Committee Representative. In order to provide a more holistic view of the expected roles and duties, the consultation will be limited to elected members of the Presidential Wing<strong className='text-red-600'>***</strong>
            </li>
          </ol>
          <p className='text-red-600 mt-4'><strong>***</strong> The full list of members can be found in the AY 2026/2027 NUS Students' Computing Club Election Standing Orders under the <a href='#documents-section' className='text-blue-600 underline'>documents</a>.</p>
        </div>
      </div>

      <div className='border-t border-gray-300 my-10 mx-auto md:w-[48%] w-full'></div>

      {/* CAMPAIGN PROCESS */}
      <div className='my-10 md:w-[45%] w-full flex justify-center flex-col mx-auto'>
        <p className='text-2xl font-bold mb-4 text-primary'>Campaign Process</p>
        <div className='ml-4'>
          <ol className='list-decimal space-y-4'>
            <li>Campaign period: <b><u>25 August 2026, 1200H - 30 August 2026, 2359H</u></b></li>
            <li>Nominees are to abide by the rules and regulations laid out in the <a href='#documents-section' className='text-blue-600 underline'>Computing Club Election Standing Orders.</a></li>
            <li>The External General Meeting, including candidate speeches and Q&amp;A, will be held on <b><u>27 - 29 August 2026</u></b>.</li>
            <li>All Nominees are required to prepare a set of slides based on the following statements:
              <ol className='list-decimal list-inside ml-6 mt-2 space-y-3'>
                <li>A general introduction about yourself</li>
                <li>Which role do you wish to take up and why?</li>
                <li>What relevant past experiences (if any) do you have?</li>
                <li>What qualities do you possess that make you suitable for this role?</li>
                <li>What are your goals and how do you intend to achieve them?</li>
              </ol>
            </li>
            <li>You may include any additional information that supports your campaign.</li>
            <li>More information regarding the physical speech will be released via a confirmation email.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default ElectionsProcess;
